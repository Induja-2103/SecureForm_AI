import puppeteer from 'puppeteer';
import { Opportunity } from '../types';
import crypto from 'crypto';

export async function extractOpportunity(targetUrl: string): Promise<Opportunity> {
  let title = "Extracted Application Form";
  let textContent = "";
  let domFormQuestions: string[] = [];

  try {
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote', '--single-process'] 
    });
    const page = await browser.newPage();
    
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 3000 });
    title = await page.title();
    
    // Extract visible text for heuristic analysis
    textContent = await page.evaluate(() => document.body.innerText);
    
    // Extract real form question fields directly from DOM
    domFormQuestions = await page.evaluate(() => {
      const questions: string[] = [];
      
      // Google Forms question headers (.M7eYe, .geS5ec, role="heading")
      const gfHeaders = Array.from(document.querySelectorAll('.M7eYe, .geS5ec, [role="listitem"] div[role="heading"]'));
      gfHeaders.forEach(el => {
        const txt = el.textContent?.trim().replace(/[\*\:]$/, '');
        if (txt && txt.length > 1 && !txt.includes('Sign in') && !txt.includes('Submit') && !txt.includes('Page')) {
          if (!questions.includes(txt)) questions.push(txt);
        }
      });

      if (questions.length > 0) return questions;

      // Generic HTML inputs, textareas, labels
      const inputElements = Array.from(document.querySelectorAll('label, input:not([type="hidden"]):not([type="submit"]), textarea, select'));
      inputElements.forEach(el => {
        let txt = '';
        if (el.tagName.toLowerCase() === 'label') {
          txt = el.textContent || '';
        } else {
          txt = el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('name') || '';
        }
        txt = txt.trim().replace(/[\*\:]$/, '');
        if (txt && txt.length > 2 && txt.length < 80) {
          const lower = txt.toLowerCase();
          if (!['submit', 'search', 'cancel', 'reset', 'password', 'sign in'].includes(lower)) {
            if (!questions.includes(txt)) questions.push(txt);
          }
        }
      });

      return questions;
    });

    await browser.close();
  } catch (e: any) {
    // Ultra-fast HTTP Fetch Fallback if Puppeteer is slow (~100ms)
    try {
      const res = await fetch(targetUrl, { signal: AbortSignal.timeout(2000) });
      const html = await res.text();
      textContent = html.replace(/<[^>]*>?/gm, ' ');
    } catch (err) {
      textContent = targetUrl;
    }
  }

  // Basic heuristic extraction
  const lowerText = textContent.toLowerCase();
  const org = new URL(targetUrl).hostname.replace("www.", "");
  
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Extract the following information from this job/internship/scholarship application page text:
        - Title (string, max 50 chars)
        - Type (must be exactly "internship", "scholarship", or "job")
        - Minimum CGPA requirement (number, use 0 if not specified)
        - Required Skills (array of strings, e.g., ["React", "Python"])
        - Questions (array of strings, extract ONLY the exact questions/fields requested in the form, e.g., ["Email", "Name", "Phone no"])
        
        Respond with ONLY a valid JSON object matching this structure:
        {
          "title": "...",
          "type": "...",
          "min_cgpa": 0.0,
          "required_skills": ["..."],
          "questions": ["...", "..."]
        }
        
        Text Content:
        ${textContent.substring(0, 10000)}
      `;
      
      const modelsToTry = ['gemini-3.8-flash'];
      let response;
      for (const model of modelsToTry) {
        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 3500));
          response = await Promise.race([
            ai.models.generateContent({ model, contents: prompt }),
            timeoutPromise
          ]) as any;
          if (response?.text) break;
        } catch (e: any) {
          console.warn(`[Gemini Extractor] AI call skipped/failed: ${e.message || e.status || e}`);
        }
      }
      
      if (response?.text) {
        let aiText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(aiText);
        const finalQuestions = (parsed.questions && parsed.questions.length > 0)
          ? parsed.questions 
          : domFormQuestions.length > 0 
          ? domFormQuestions 
          : ["Email", "Name", "Phone no"];

        return {
          opportunity_id: `opp_${crypto.randomBytes(4).toString('hex')}`,
          title: parsed.title || title.substring(0, 50) || "Extracted Application Form",
          org: org,
          type: parsed.type === "internship" || parsed.type === "scholarship" ? parsed.type : "job",
          requirements: {
            min_cgpa: parsed.min_cgpa || 0,
            required_skills: parsed.required_skills || [],
            eligibility_text: "Extracted from page content using Gemini AI."
          },
          questions: finalQuestions,
          deadline: null, 
          apply_url: targetUrl,
          data_quality: "complete"
        };
      }
    } catch (error: any) {
      console.warn("[Gemini Extractor] Fallback to heuristic:", error.message || error);
    }
  }
  
  let minCgpa = 0;
  const cgpaMatch = textContent.match(/cgpa.*?([0-9]\.[0-9])/i);
  if (cgpaMatch) {
    minCgpa = parseFloat(cgpaMatch[1]);
  }

  const possibleSkills = ["React", "Python", "JavaScript", "Java", "C++", "SQL", "Machine Learning", "Node.js", "TypeScript"];
  const requiredSkills = possibleSkills.filter(s => lowerText.includes(s.toLowerCase()));

  const finalQuestions = domFormQuestions.length > 0 
    ? domFormQuestions 
    : ["Email", "Name", "Phone no"];

  return {
    opportunity_id: `opp_${crypto.randomBytes(4).toString('hex')}`,
    title: title.substring(0, 50) || "Extracted Application Form",
    org: org,
    type: lowerText.includes("internship") ? "internship" : lowerText.includes("scholarship") ? "scholarship" : "job",
    requirements: {
      min_cgpa: minCgpa,
      required_skills: requiredSkills,
      eligibility_text: "Extracted from page content using heuristic matching."
    },
    questions: finalQuestions,
    deadline: null, 
    apply_url: targetUrl,
    data_quality: "incomplete"
  };
}
