import { useState, useMemo } from "react";
import ContactCard from "./ContactCard";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

function ContactList({ contacts, onEdit, onDelete, isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterTitle, setFilterTitle] = useState("");

  // Get unique titles for filter
  const uniqueTitles = useMemo(() => {
    const titles = contacts
      .map((c) => c.title)
      .filter((title) => title && title.trim() !== "");
    return [...new Set(titles)];
  }, [contacts]);

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (contact) =>
          contact.firstName?.toLowerCase().includes(term) ||
          contact.lastName?.toLowerCase().includes(term) ||
          contact.emailAddresses?.some((email) =>
            email.email.toLowerCase().includes(term)
          ) ||
          contact.phoneNumbers?.some((phone) =>
            phone.phoneNumber.includes(term)
          )
      );
    }

    // Title filter
    if (filterTitle) {
      result = result.filter((contact) => contact.title === filterTitle);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.firstName || "").localeCompare(b.firstName || "");
        case "email":
          const emailA = a.emailAddresses?.[0]?.email || "";
          const emailB = b.emailAddresses?.[0]?.email || "";
          return emailA.localeCompare(emailB);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return result;
  }, [contacts, searchTerm, sortBy, filterTitle]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterTitle("");
    setSortBy("name");
  };

  const hasActiveFilters = searchTerm || filterTitle || sortBy !== "name";

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="py-2 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#3D5A80]" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#98C1D9] transition-all duration-200 ${isDarkMode ? "bg-[#242B31] text-[#F7FAFC] placeholder:text-[#89939C]" : "bg-white text-[#293241] placeholder:text-[#8293A3]"}`}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-[#3D5A80]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-3 rounded-xl border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#98C1D9] transition-all duration-200 ${isDarkMode ? "bg-[#242B31] text-[#F7FAFC]" : "bg-white text-[#293241]"}`}
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Title Filter */}
          {uniqueTitles.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#3D5A80]" />
              <select
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
                className={`px-3 py-3 rounded-xl border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#98C1D9] transition-all duration-200 ${isDarkMode ? "bg-[#242B31] text-[#F7FAFC]" : "bg-white text-[#293241]"}`}
              >
                <option value="">All Titles</option>
                {uniqueTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-4 py-2.5 text-sm rounded-full transition-all duration-200 flex items-center gap-1 ${isDarkMode ? "text-[#AFCBDD] hover:bg-white/10" : "text-[#16425B] hover:bg-[#E7F1F6]"}`}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className={`flex items-center justify-between text-sm ${isDarkMode ? "text-[#98C1D9]" : "text-[#3D5A80]"}`}>
        <p>
          Showing {filteredAndSortedContacts.length} of {contacts.length} contacts
        </p>
      </div>

      {/* Contact Cards Grid */}
      {filteredAndSortedContacts.length === 0 ? (
        <div className={`text-center py-14 rounded-2xl ${isDarkMode ? "bg-[#242B31]" : "bg-white shadow-sm"}`}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E0FBFC] mb-4">
            <Search className="h-7 w-7 text-[#3D5A80]" />
          </div>
          <h3 className={`text-lg font-medium ${isDarkMode ? "text-[#F7FAFC]" : "text-[#293241]"}`}>
            No contacts found
          </h3>
          <p className={`mt-1 ${isDarkMode ? "text-[#B7C0C7]" : "text-[#3D5A80]"}`}>
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "Add your first contact to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={onEdit}
              onDelete={onDelete}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactList;
