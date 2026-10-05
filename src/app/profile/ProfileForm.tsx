"use client";

import { useState } from "react";
import { UserProfile, ExtraDetail } from "@/types";
import { Book, Briefcase, FileText, User, Save, X, PlusCircle, Trash2, Phone, Plus } from "lucide-react";
import { updateProfileAction } from "./actions";

export default function ProfileForm({ initialProfile }: { initialProfile: UserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [newExtraKey, setNewExtraKey] = useState("");
  const [newExtraValue, setNewExtraValue] = useState("");
  const [showAddExtra, setShowAddExtra] = useState(false);

  const handleSave = async () => {
    await updateProfileAction(profile);
    setIsEditing(false);
  };

  const handleAddExtraDetail = () => {
    if (!newExtraKey.trim() || !newExtraValue.trim()) return;
    const newDetail: ExtraDetail = {
      id: `extra_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      key: newExtraKey.trim(),
      value: newExtraValue.trim()
    };
    const updated = [...(profile.extra_details || []), newDetail];
    const newProf = { ...profile, extra_details: updated };
    setProfile(newProf);
    setNewExtraKey("");
    setNewExtraValue("");
    setShowAddExtra(false);

    if (!isEditing) {
      updateProfileAction(newProf);
    }
  };

  const handleRemoveExtraDetail = (id: string) => {
    const updated = (profile.extra_details || []).filter(item => item.id !== id);
    const newProf = { ...profile, extra_details: updated };
    setProfile(newProf);
    if (!isEditing) {
      updateProfileAction(newProf);
    }
  };

  if (!isEditing) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-safe">CYBERSHIELD SECURE PROFILE</span>
              <span className="badge badge-blue" style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }}>
                WORKSPACE: {profile.first_name || profile.email}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>My Profile</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.88rem' }}>
              Isolated credential vault for <strong style={{ color: '#fff' }}>{profile.email}</strong>.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Identity & Education & Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <User size={20} color="var(--accent-primary)"/> Identity
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{profile.first_name} {profile.last_name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{profile.email}</div>
                {profile.phone_number && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                    <Phone size={14} color="var(--accent-primary)" /> {profile.phone_number}
                  </div>
                )}
              </div>
            </div>

            {/* Extra Details Card */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <PlusCircle size={20} color="var(--accent-primary)"/> Extra Profile Details
                </h3>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddExtra(true)} 
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Add Detail
                </button>
              </div>

              {showAddExtra && (
                <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      className="input-field" 
                      placeholder="Key (e.g., Phone Number, LinkedIn)" 
                      value={newExtraKey} 
                      onChange={e => setNewExtraKey(e.target.value)} 
                    />
                    <input 
                      className="input-field" 
                      placeholder="Value" 
                      value={newExtraValue} 
                      onChange={e => setNewExtraValue(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={handleAddExtraDetail}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setShowAddExtra(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {profile.extra_details && profile.extra_details.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {profile.extra_details.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>{item.key}</div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.value}</div>
                      </div>
                      <button 
                        onClick={() => handleRemoveExtraDetail(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                        title="Delete Detail"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  No extra profile details added yet. Click <strong>+ Add Detail</strong> to add phone numbers, social links, or custom details.
                </p>
              )}
            </div>

            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Book size={20} color="var(--accent-primary)"/> Education
              </h3>
              {profile.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{edu.degree}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{edu.institution} • Class of {edu.year}</div>
                  <div className="badge badge-success" style={{ marginTop: '0.5rem' }}>CGPA: {edu.cgpa}</div>
                </div>
              ))}
            </div>

            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <User size={20} color="var(--accent-primary)"/> Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-neutral">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience & Documents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Briefcase size={20} color="var(--accent-primary)"/> Experience
              </h3>
              {profile.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{exp.role}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{exp.org} • {exp.duration}</div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{exp.description}</p>
                </div>
              ))}
            </div>

            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FileText size={20} color="var(--accent-primary)"/> Documents
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>📄 {profile.documents.resume_url.split('/').pop()}</a>
                <a href="#" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>🎓 {profile.documents.transcript_url.split('/').pop()}</a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Edit Mode
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Edit Profile</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            <X size={16} /> Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
             <h3 style={{ marginBottom: '1rem' }}>Identity & Contact</h3>
             <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
               <input className="input-field" value={profile.first_name || ""} onChange={e => setProfile({...profile, first_name: e.target.value})} placeholder="First Name" />
               <input className="input-field" value={profile.last_name || ""} onChange={e => setProfile({...profile, last_name: e.target.value})} placeholder="Last Name" />
             </div>
             <input className="input-field" style={{ marginBottom: '1rem' }} value={profile.email || ""} onChange={e => setProfile({...profile, email: e.target.value})} placeholder="Email Address" />
             <input className="input-field" value={profile.phone_number || ""} onChange={e => setProfile({...profile, phone_number: e.target.value})} placeholder="Phone Number (e.g. +1 234 567 8900)" />
          </div>

          <div className="glass-card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <h3>Extra Details</h3>
               <button 
                 type="button"
                 className="btn btn-secondary" 
                 onClick={() => setShowAddExtra(true)}
                 style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
               >
                 <Plus size={14} /> Add Detail
               </button>
             </div>

             {showAddExtra && (
                <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      className="input-field" 
                      placeholder="Key (e.g., LinkedIn, Address)" 
                      value={newExtraKey} 
                      onChange={e => setNewExtraKey(e.target.value)} 
                    />
                    <input 
                      className="input-field" 
                      placeholder="Value" 
                      value={newExtraValue} 
                      onChange={e => setNewExtraValue(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" className="btn btn-primary" onClick={handleAddExtraDetail}>Add to Profile</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddExtra(false)}>Cancel</button>
                  </div>
                </div>
              )}

             {profile.extra_details && profile.extra_details.map((item, idx) => (
               <div key={item.id || idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                 <input 
                   className="input-field" 
                   value={item.key} 
                   onChange={e => {
                     const updated = [...(profile.extra_details || [])];
                     updated[idx].key = e.target.value;
                     setProfile({...profile, extra_details: updated});
                   }} 
                   placeholder="Detail Key" 
                   style={{ flex: 1 }}
                 />
                 <input 
                   className="input-field" 
                   value={item.value} 
                   onChange={e => {
                     const updated = [...(profile.extra_details || [])];
                     updated[idx].value = e.target.value;
                     setProfile({...profile, extra_details: updated});
                   }} 
                   placeholder="Detail Value" 
                   style={{ flex: 2 }}
                 />
                 <button 
                   type="button"
                   onClick={() => handleRemoveExtraDetail(item.id)}
                   style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
          </div>

          <div className="glass-card">
             <h3 style={{ marginBottom: '1rem' }}>Education</h3>
             {profile.education.map((edu, idx) => (
               <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                 <input className="input-field" value={edu.degree} onChange={e => {
                   const newEdu = [...profile.education];
                   newEdu[idx].degree = e.target.value;
                   setProfile({...profile, education: newEdu});
                 }} placeholder="Degree" />
                 <input className="input-field" value={edu.institution} onChange={e => {
                   const newEdu = [...profile.education];
                   newEdu[idx].institution = e.target.value;
                   setProfile({...profile, education: newEdu});
                 }} placeholder="Institution" />
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <input className="input-field" type="number" step="0.01" value={edu.cgpa} onChange={e => {
                     const newEdu = [...profile.education];
                     newEdu[idx].cgpa = parseFloat(e.target.value) || 0;
                     setProfile({...profile, education: newEdu});
                   }} placeholder="CGPA" />
                   <input className="input-field" type="number" value={edu.year} onChange={e => {
                     const newEdu = [...profile.education];
                     newEdu[idx].year = parseInt(e.target.value) || 0;
                     setProfile({...profile, education: newEdu});
                   }} placeholder="Year" />
                 </div>
               </div>
             ))}
          </div>

          <div className="glass-card">
             <h3 style={{ marginBottom: '1rem' }}>Skills (comma separated)</h3>
             <textarea className="input-field" style={{ minHeight: '100px' }} value={profile.skills.join(", ")} onChange={e => {
                 setProfile({...profile, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s)});
             }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
             <h3 style={{ marginBottom: '1rem' }}>Experience</h3>
             {profile.experience.map((exp, idx) => (
               <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                 <input className="input-field" value={exp.role} onChange={e => {
                   const newExp = [...profile.experience];
                   newExp[idx].role = e.target.value;
                   setProfile({...profile, experience: newExp});
                 }} placeholder="Role" />
                 <input className="input-field" value={exp.org} onChange={e => {
                   const newExp = [...profile.experience];
                   newExp[idx].org = e.target.value;
                   setProfile({...profile, experience: newExp});
                 }} placeholder="Organization" />
                 <input className="input-field" value={exp.duration} onChange={e => {
                   const newExp = [...profile.experience];
                   newExp[idx].duration = e.target.value;
                   setProfile({...profile, experience: newExp});
                 }} placeholder="Duration" />
                 <textarea className="input-field" value={exp.description} onChange={e => {
                   const newExp = [...profile.experience];
                   newExp[idx].description = e.target.value;
                   setProfile({...profile, experience: newExp});
                 }} placeholder="Description" />
               </div>
             ))}
          </div>

          <div className="glass-card">
             <h3 style={{ marginBottom: '1rem' }}>Documents (PDF)</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div>
                 <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                   Resume {profile.documents?.resume_url && `(Current: ${profile.documents.resume_url.split('/').pop()})`}
                 </label>
                 <input type="file" accept=".pdf" className="input-field" onChange={e => {
                   const file = e.target.files?.[0];
                   if (file) {
                     setProfile({...profile, documents: {...profile.documents, resume_url: file.name}});
                   }
                 }} />
               </div>
               <div style={{ marginTop: '0.5rem' }}>
                 <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                   Transcript {profile.documents?.transcript_url && `(Current: ${profile.documents.transcript_url.split('/').pop()})`}
                 </label>
                 <input type="file" accept=".pdf" className="input-field" onChange={e => {
                   const file = e.target.files?.[0];
                   if (file) {
                     setProfile({...profile, documents: {...profile.documents, transcript_url: file.name}});
                   }
                 }} />
               </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
