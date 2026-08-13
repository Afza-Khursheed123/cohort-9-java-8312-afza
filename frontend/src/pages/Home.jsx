import { useEffect, useMemo, useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import contactApi from "../api/contactApi";
import ContactForm from "../components/ContactForm";
import ContactList from "../components/ContactList";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { Users, Plus, Moon, Sun } from "lucide-react";

function Home() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const formRef = useRef(null);
  const loadRequestId = useRef(0);
  const contactsVersion = useRef(0);
  const editFormData = useMemo(
    () =>
      editingContact
        ? {
            firstName: editingContact.firstName || "",
            lastName: editingContact.lastName || "",
            title: editingContact.title || "",
            email: editingContact.emailAddresses?.[0]?.email || "",
            phone: editingContact.phoneNumbers?.[0]?.phoneNumber || "",
          }
        : null,
    [editingContact],
  );

  async function loadContacts() {
    const requestId = ++loadRequestId.current;
    const requestContactsVersion = contactsVersion.current;
    setLoading(true);
    try {
      const response = await contactApi.get("/contacts");
      if (
        requestId === loadRequestId.current &&
        requestContactsVersion === contactsVersion.current
      ) {
        setContacts(response.data);
        setLoadError(false);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      if (
        requestId === loadRequestId.current &&
        requestContactsVersion === contactsVersion.current
      ) {
        setLoadError(true);
        toast.error("Unable to load contacts. Please try again.");
      }
    } finally {
      if (
        requestId === loadRequestId.current &&
        requestContactsVersion === contactsVersion.current
      ) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const saveContact = async (data) => {
    const contact = {
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      emailAddresses: [
        {
          email: data.email,
          label: "Personal",
        },
      ],
      phoneNumbers: [
        {
          phoneNumber: data.phone,
          label: "Mobile",
        },
      ],
    };

    try {
      const response = await contactApi.post("/contacts", contact);
      contactsVersion.current += 1;
      setContacts((currentContacts) => {
        const contactIndex = currentContacts.findIndex(
          (currentContact) => currentContact.id === response.data.id,
        );

        if (contactIndex === -1) {
          return [...currentContacts, response.data];
        }

        return currentContacts.map((currentContact, index) =>
          index === contactIndex ? response.data : currentContact,
        );
      });
      void loadContacts();
      toast.success("Contact added successfully!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#16425B",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "8px",
        },
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Unable to add contact. Please try again.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#EE6C4D",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateContact = async (data) => {
    if (!editingContact) {
      setIsSubmitting(false);
      return;
    }

    const contact = {
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      emailAddresses: [
        {
          email: data.email,
          label: editingContact.emailAddresses?.[0]?.label || "Personal",
        },
      ],
      phoneNumbers: [
        {
          phoneNumber: data.phone,
          label: editingContact.phoneNumbers?.[0]?.label || "Mobile",
        },
      ],
    };

    try {
      const response = await contactApi.put(
        `/contacts/${editingContact.id}`,
        contact,
      );
      contactsVersion.current += 1;
      setContacts((currentContacts) =>
        currentContacts.map((currentContact) =>
          currentContact.id === response.data.id
            ? response.data
            : currentContact,
        ),
      );
      void loadContacts();
      toast.success("Contact updated successfully!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#16425B",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "8px",
        },
      });
      setEditingContact(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Unable to update contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
    setTimeout(scrollToForm, 100);
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setShowForm(false);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-[#171C21]" : "bg-[#EEF1F3]"
      }`}
    >
      <Toaster />
      
      {/* Header */}
      <div className={`sticky top-0 z-10 shadow-sm transition-colors duration-300 ${isDarkMode ? "bg-[#20262C]" : "bg-[#16425B]"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#E0FBFC]/15 p-2.5 rounded-xl">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#E0FBFC]">
                  Contact Management
                </h1>
                <p className="text-sm text-[#98C1D9] flex items-center gap-1.5">
                  Stay connected, stay organized
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDarkMode((currentMode) => !currentMode)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#E0FBFC] hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#98C1D9] transition-all duration-200"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  setEditingContact(null);
                  setShowForm(!showForm);
                  if (!showForm) {
                    setTimeout(scrollToForm, 100);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#EE6C4D] text-white rounded-full font-semibold hover:bg-[#F07A5E] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-5 w-5" />
                {showForm ? "Close Form" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Contact Form */}
        <div ref={formRef}>
          {showForm && (
            <div
              className={`mb-10 rounded-2xl p-8 shadow-lg animate-fade-in-up transition-all duration-300 ${
                isDarkMode
                  ? "bg-[#242B31] shadow-black/25"
                  : "bg-white shadow-[#16425B]/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-7">
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-[#F7FAFC]" : "text-[#16425B]"}`}>
                  {editingContact ? "Edit Contact" : "Add New Contact"}
                </h2>
                <span className={`text-sm ml-auto ${isDarkMode ? "text-[#AFCBDD]" : "text-[#60758A]"}`}>
                   Fill in the details below
                </span>
              </div>
              <ContactForm
                key={editingContact?.id || "new"}
                onSave={editingContact ? updateContact : saveContact}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                initialData={editFormData}
                onCancel={cancelEdit}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>

        {/* Contact List */}
        {loading ? (
          <LoadingSpinner isDarkMode={isDarkMode} />
        ) : loadError ? (
          <>
            {contacts.length > 0 && (
              <ContactList contacts={contacts} onEdit={editContact} isDarkMode={isDarkMode} />
            )}
            <div className="rounded-lg border border-[#EE6C4D] bg-white p-6 text-center">
              <p className="text-[#293241]">Unable to load contacts.</p>
              <button
                type="button"
                onClick={loadContacts}
                className="mt-4 rounded-lg bg-[#16425B] px-4 py-2 font-semibold text-white hover:bg-[#3D5A80]"
              >
                Try Again
              </button>
            </div>
          </>
        ) : contacts.length === 0 ? (
          <EmptyState onAddContact={() => setShowForm(true)} isDarkMode={isDarkMode} />
        ) : (
          <ContactList contacts={contacts} onEdit={editContact} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
}

export default Home;
