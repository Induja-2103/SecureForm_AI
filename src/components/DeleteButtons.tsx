"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  deleteOpportunityAction, 
  deleteTrackingRecordAction, 
  deleteEmailOpportunityAction 
} from "@/app/actions/opportunities";

export function DeleteOpportunityButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${title || id}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteOpportunityAction(id);
      if (res?.success) {
        router.refresh();
      }
    } catch (err: any) {
      console.error("Failed to delete opportunity:", err);
      alert("Failed to delete opportunity: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-secondary"
      style={{
        padding: '0.35rem 0.5rem',
        color: 'var(--danger)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        opacity: isDeleting ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title="Delete Opportunity & Tracked Application"
    >
      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}

export function DeleteTrackingButton({ id, title }: { id: string; title?: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete application track for "${title || id}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteTrackingRecordAction(id);
      if (res?.success) {
        router.refresh();
      }
    } catch (err: any) {
      console.error("Failed to delete tracking record:", err);
      alert("Failed to delete tracking record: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-secondary"
      style={{
        padding: '0.35rem 0.5rem',
        color: 'var(--danger)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        opacity: isDeleting ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title="Delete Application Track"
    >
      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}

export function DeleteEmailOpportunityButton({ id, title }: { id: string; title?: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete inbox opportunity "${title || id}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteEmailOpportunityAction(id);
      if (res?.success) {
        router.refresh();
      }
    } catch (err: any) {
      console.error("Failed to delete email opportunity:", err);
      alert("Failed to delete email opportunity: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-secondary"
      style={{
        padding: '0.35rem 0.5rem',
        color: 'var(--danger)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        opacity: isDeleting ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title="Delete Inbox Opportunity"
    >
      {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
