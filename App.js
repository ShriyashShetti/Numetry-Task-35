import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Toast,
  Spinner,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);

  const contactId = 1;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/contacts/${contactId}/notes`);
      setNotes(res.data);
    } catch {
      setToast({ show: true, message: 'Failed to load notes', variant: 'danger' });
    }
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await axios.post(`http://localhost:8080/contacts/${contactId}/notes`, {
        note_text: noteText,
      });
      setNoteText('');
      setShowModal(false);
      setToast({ show: true, message: 'Note added!', variant: 'success' });
      fetchNotes();
    } catch {
      setToast({ show: true, message: 'Failed to add note', variant: 'danger' });
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await axios.delete(`http://localhost:8080/notes/${noteId}`);
      setToast({ show: true, message: 'Note deleted', variant: 'warning' });
      fetchNotes();
    } catch {
      setToast({ show: true, message: 'Failed to delete', variant: 'danger' });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container className="py-5">
      <style>{`
        body {
          background: linear-gradient(to right, #d0eaff, #f1d9f9);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .bg-glass {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 1rem;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }
        .note-card:hover {
          transform: scale(1.01);
          transition: all 0.2s ease-in-out;
          border-left: 5px solid #0d6efd;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        .animate-slide-in {
          animation: slideIn 1s ease-out;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <Card className="shadow-lg bg-glass">
        <Card.Body>
          <h2 className="text-center text-primary mb-4 animate-fade-in">📝 Contact Notes</h2>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p>Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <p className="text-center text-muted">No notes available.</p>
          ) : (
            <div className="animate-slide-in">
              {notes.map((note) => (
                <Card className="mb-3 bg-light shadow-sm border-0 note-card" key={note.id}>
                  <Card.Body>
                    <Row>
                      <Col md={10}>
                        <Card.Text>{note.note_text}</Card.Text>
                        <small className="text-muted">
                          🕒 {new Date(note.created_at).toLocaleString()}
                        </small>
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(note.id)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Button variant="primary" onClick={() => setShowModal(true)} className="animate-bounce">
              ➕ Add Note
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddNote}>
            Save Note
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        delay={3000}
        autohide
        bg={toast.variant}
        className="position-fixed bottom-0 end-0 m-4"
      >
        <Toast.Body className="text-white">{toast.message}</Toast.Body>
      </Toast>
    </Container>
  );
}

export default App;
