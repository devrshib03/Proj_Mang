"use client";

import { useState } from "react";
import { Plus, Search, User, Mail, Phone, MoreVertical, Edit, Trash2, Users, Crown, Eye, Settings } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  status: "active" | "inactive";
  joinDate: string;
  avatar?: string;
  projects: number;
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Akwasi Asante",
      email: "mtechsolutions2000@gmail.com",
      phone: "+1 (555) 123-4567",
      role: "OWNER",
      status: "active",
      joinDate: "2024-01-15",
      projects: 0,
    },
    {
      id: "2",
      name: "Codewave",
      email: "codewave@example.com",
      phone: "+1 (555) 987-6543",
      role: "VIEWER",
      status: "active",
      joinDate: "2024-02-20",
      projects: 0,
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 456-7890",
      role: "MEMBER",
      status: "active",
      joinDate: "2024-01-10",
      projects: 2,
    },
  ]);

  const [selectedMember, setSelectedMember] = useState<Member | null>(members[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "MEMBER" as "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
  });

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.email && newMember.role) {
      const member: Member = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        role: newMember.role,
        status: "active",
        joinDate: new Date().toISOString().split('T')[0],
        projects: 0,
      };
      setMembers([...members, member]);
      setNewMember({ name: "", email: "", phone: "", role: "MEMBER" });
      setShowAddMember(false);
    }
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleRemoveMember = (member: Member) => {
    setMemberToRemove(member);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      // Remove the member from the list
      const updatedMembers = members.filter((member) => member.id !== memberToRemove.id);
      setMembers(updatedMembers);
      
      // If the removed member was selected, select the first available member or null
      if (selectedMember?.id === memberToRemove.id) {
        setSelectedMember(updatedMembers.length > 0 ? updatedMembers[0] : null);
      }
      
      // Close the confirmation dialog
      setShowRemoveConfirm(false);
      setMemberToRemove(null);
    }
  };

  const cancelRemoveMember = () => {
    setShowRemoveConfirm(false);
    setMemberToRemove(null);
  };

  const toggleMemberStatus = (id: string) => {
    setMembers(
      members.map((member) =>
        member.id === id
          ? { ...member, status: member.status === "active" ? "inactive" : "active" }
          : member
      )
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown size={16} className="text-red-600" />;
      case "ADMIN":
        return <Settings size={16} className="text-blue-600" />;
      case "MEMBER":
        return <Users size={16} className="text-green-600" />;
      case "VIEWER":
        return <Eye size={16} className="text-gray-600" />;
      default:
        return <Users size={16} className="text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "MEMBER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "VIEWER":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Workspace Members */}
      <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Workspace Members
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your workspace members and their access levels.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Members List */}
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedMember?.id === member.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {member.projects} project(s)
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Member Button */}
        <button
          onClick={() => setShowAddMember(true)}
          className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Right Panel - Member Details */}
      <div className="w-1/2 p-6">
        {selectedMember ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Member Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and manage {selectedMember.name}'s access and projects.
              </p>
            </div>

            {/* Member Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedMember.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedMember.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleIcon(selectedMember.role)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(selectedMember.role)}`}>
                        {selectedMember.role}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveMember(selectedMember)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Remove User
                </button>
              </div>
            </div>

            {/* Assigned Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Assigned Projects
              </h3>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Project
                      </th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Access
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No projects assigned
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a member
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a member from the list to view their details
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-w-[90vw] mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Member
              </h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select
                  required
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as "OWNER" | "ADMIN" | "MEMBER" | "VIEWER" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveConfirm && memberToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[400px] max-w-[90vw] mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Remove Member
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to remove <strong>{memberToRemove.name}</strong> from the workspace?
                </p>
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} />
                    <span>{memberToRemove.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {getRoleIcon(memberToRemove.role)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(memberToRemove.role)}`}>
                      {memberToRemove.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelRemoveMember}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveMember}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                           hover:bg-red-700 rounded-lg transition-colors"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
