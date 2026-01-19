"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";

type Lead = {
  id: string;
  clientName: string;
  phone: string;
  businessType: string;
  hasWebsite: string;
  addedBy: {
    uid: string;
    name: string;
  };
  createdAt: any;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [hasWebsite, setHasWebsite] = useState("");
  const [addedBy, setAddedBy] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // 🔐 Get user role
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const role = userSnap.data()?.role;

      let q;

      // 🔥 ROLE BASED QUERY
      if (role === "admin") {
        q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      } else {
        q = query(
          collection(db, "leads"),
          where("addedBy.uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
      }

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Lead[];

      setLeads(data);
      setFilteredLeads(data);
    };

    fetchLeads();
  }, []);

  // 🔍 FILTER LOGIC
  useEffect(() => {
    let data = [...leads];

    if (search) {
      data = data.filter(
        (lead) =>
          lead.clientName.toLowerCase().includes(search.toLowerCase()) ||
          lead.phone.includes(search)
      );
    }

    if (businessType) {
      data = data.filter((lead) => lead.businessType === businessType);
    }

    if (hasWebsite) {
      data = data.filter((lead) => lead.hasWebsite === hasWebsite);
    }

    if (addedBy) {
      data = data.filter((lead) => lead.addedBy.uid === addedBy);
    }

    setFilteredLeads(data);
  }, [search, businessType, hasWebsite, addedBy, leads]);

  // Unique users for filter
  const uniqueUsers = Array.from(
    new Map(leads.map((l) => [l.addedBy.uid, l.addedBy])).values()
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          placeholder="Search name or phone"
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
        >
          <option value="">All Businesses</option>
          <option value="Gym">Gym</option>
          <option value="School">School</option>
          <option value="Hospital">Hospital</option>
          <option value="Shop">Shop</option>
        </select>

        <select
          className="border p-2 rounded"
          value={hasWebsite}
          onChange={(e) => setHasWebsite(e.target.value)}
        >
          <option value="">Has Website?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <select
          className="border p-2 rounded"
          value={addedBy}
          onChange={(e) => setAddedBy(e.target.value)}
        >
          <option value="">Added By</option>
          {uniqueUsers.map((user) => (
            <option key={user.uid} value={user.uid}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Client Name</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Business</th>
              <th className="border p-2 text-left">Website</th>
              <th className="border p-2 text-left">Added By</th>
              <th className="border p-2 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No leads found
                </td>
              </tr>
            )}

            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="border p-2">{lead.clientName}</td>
                <td className="border p-2">{lead.phone}</td>
                <td className="border p-2">{lead.businessType}</td>
                <td className="border p-2 capitalize">
                  {lead.hasWebsite}
                </td>
                <td className="border p-2">{lead.addedBy.name}</td>
                <td className="border p-2">
                  {lead.createdAt?.toDate().toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
