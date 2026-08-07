import { useEffect, useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import contactApi from "../api/contactApi";
import ContactForm from "../components/ContactForm";
import ContactList from "../components/ContactList";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { Users, Plus, Star } from "lucide-react";

function Home() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  async function loadContacts() {
    setLoading(true);
    try {
      const response = await contactApi.get("/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Unable to load contacts. Please try again.");
    } finally {
      setLoading(false);
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
      setContacts((currentContacts) => [...currentContacts, response.data]);
      toast.success("Contact added successfully!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "linear-gradient(135deg, #10B981, #059669)",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
        },
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Unable to add contact. Please try again.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "linear-gradient(135deg, #EF4444, #DC2626)",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
        },
        icon: "😅",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-violet-50/30">
      <Toaster />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Contact Management
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  Stay connected, stay organized
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) {
                  setTimeout(scrollToForm, 100);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              {showForm ? "Close Form" : "Add Contact"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Contact Form */}
        <div ref={formRef}>
          {showForm && (
            <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 p-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-violet-500 p-2 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Contact
                </h2>
                <span className="text-sm text-gray-400 ml-auto">
                   Fill in the details below
                </span>
              </div>
              <ContactForm
                onSave={saveContact}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            </div>
          )}
        </div>

        {/* Contact List */}
        {loading ? (
          <LoadingSpinner />
        ) : contacts.length === 0 ? (
          <EmptyState onAddContact={() => setShowForm(true)} />
        ) : (
          <ContactList contacts={contacts} />
        )}
      </div>
    </div>
  );
}

export default Home;
