"use client";

import { useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import toast from "react-hot-toast";

export default function AddLeadPage() {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [hasWebsite, setHasWebsite] = useState("no");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔴 BASIC VALIDATION
    if (!clientName || !phone || !businessType) {
      toast.error("Please fill all required fields");
      return;
    }

    if (hasWebsite === "yes" && !websiteUrl) {
      toast.error("Website URL is required");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);

    // 🔍 DUPLICATE CHECK (PHONE)
    const q = query(collection(db, "leads"), where("phone", "==", phone));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const existingLead = snapshot.docs[0].data();

      const addedByName = existingLead.addedBy?.name || "Someone";
      const createdAt = existingLead.createdAt?.toDate();

      const formattedDate = createdAt
        ? createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "unknown date";

      toast.error(
        `This client is already added by ${addedByName} on ${formattedDate}`
      );

      setLoading(false);
      return;
    }

    // ✅ SAVE LEAD
    await addDoc(collection(db, "leads"), {
      clientName,
      phone,
      address,
      businessType,
      hasWebsite,
      websiteUrl: hasWebsite === "yes" ? websiteUrl : "",
      addedBy: {
        uid: user.uid,
        name: user.email, // later we can fetch real name
      },
      createdAt: serverTimestamp(),
    });

    toast.success("Lead added successfully");

    // reset form
    setClientName("");
    setPhone("");
    setAddress("");
    setBusinessType("");
    setHasWebsite("no");
    setWebsiteUrl("");

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Add Lead</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Client Name *"
          className="w-full border p-2 rounded"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <input
          placeholder="Phone *"
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          placeholder="Address"
          className="w-full border p-2 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
        >
          <option value="">Select Business Type *</option>
          <option value="Gym">Gym</option>
          <option value="School">School</option>
          <option value="Hospital">Hospital</option>
          <option value="Shop">Shop</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={hasWebsite}
          onChange={(e) => setHasWebsite(e.target.value)}
        >
          <option value="no">Has Website? No</option>
          <option value="yes">Has Website? Yes</option>
        </select>

        {hasWebsite === "yes" && (
          <input
            placeholder="Website URL"
            className="w-full border p-2 rounded"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        )}

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Checking..." : "Add Lead"}
        </button>
      </form>
    </div>
  );
}
