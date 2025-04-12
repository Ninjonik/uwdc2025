"use client"

import React, {startTransition, useActionState, useEffect, useState} from 'react';
import {MdCheck, MdClose} from "react-icons/md";
import handleActivityCompletion from "@/actions/handleActivityCompletion";
import fireToast from "@/utils/fireToast";
import LabelInput from "@/components/form/LabelInput";
import {FaClockRotateLeft} from "react-icons/fa6";

const ActivityCompletionForm = ({ onSubmit, onCancel, activityId }) => {
  const [reps, setReps] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, formAction] = useActionState(
      handleActivityCompletion,
      null,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    formData.set("activityId", activityId);
    startTransition(() => {
      formAction(formData);
    })
  };

  useEffect(() => {
    if(status && status?.type && status?.message){
      fireToast(status.type, status.message);
      onSubmit();
      setSubmitting(false);
    }
  }, [status]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control flex flex-col gap-2">
        <label className="label">
          <span className="label-text font-medium">How many reps did you complete?</span>
        </label>
        <LabelInput
            name={"reps"}
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Enter number of reps"
            min="0"
            svgIcon={<FaClockRotateLeft />}
        />
        <label className="label">
          <span className="label-text-alt text-neutral/60">Optional: Leave blank if not applicable</span>
        </label>
      </div>
      
      <div className="flex gap-2 justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-warning flex-1"
          disabled={submitting}
        >
          <MdClose className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={submitting}
        >
          {submitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <MdCheck className="w-4 h-4" />
          )}
          Submit
        </button>
      </div>
    </form>
  );
};

export default ActivityCompletionForm;
