import { useState, useMemo } from "react";
import ContactCard from "./ContactCard";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

function ContactList({ contacts }) {
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Title Filter */}
          {uniqueTitles.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
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
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing {filteredAndSortedContacts.length} of {contacts.length} contacts
        </p>
      </div>

      {/* Contact Cards Grid */}
      {filteredAndSortedContacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No contacts found</h3>
          <p className="text-gray-500 mt-1">
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "Add your first contact to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactList;