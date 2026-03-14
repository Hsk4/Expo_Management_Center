import { type ExpoSession } from '../../../services/expo.service';

interface ExpoSessionsEditorProps {
  sessions: ExpoSession[];
  onChange: (sessions: ExpoSession[]) => void;
}

const createEmptySession = (): ExpoSession => ({
  title: '',
  speaker: '',
  topic: '',
  location: '',
  description: '',
  startTime: '',
  endTime: '',
  capacity: 50,
});

export function ExpoSessionsEditor({ sessions, onChange }: ExpoSessionsEditorProps) {
  const handleAddSession = () => {
    onChange([...sessions, createEmptySession()]);
  };

  const handleChange = (index: number, field: keyof ExpoSession, value: string | number) => {
    onChange(
      sessions.map((session, sessionIndex) =>
        sessionIndex === index
          ? {
              ...session,
              [field]: field === 'capacity' ? Number(value) || 0 : value,
            }
          : session
      )
    );
  };

  const handleRemoveSession = (index: number) => {
    onChange(sessions.filter((_, sessionIndex) => sessionIndex !== index));
  };

  return (
    <div style={{ marginTop: '18px', display: 'grid', gap: '16px' }}>
      {sessions.length === 0 ? (
        <div
          style={{
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '18px',
            color: '#a0a0b0',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          No sessions added yet. Add a few agenda items so attendees can plan their visit.
        </div>
      ) : (
        sessions.map((session, index) => (
          <div
            key={session._id || `session-${index}`}
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '18px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '12px' }}>
              <div>
                <h4 style={{ margin: 0, color: 'white', fontSize: '16px', fontWeight: 600 }}>Session {index + 1}</h4>
                <p style={{ margin: '4px 0 0 0', color: '#707085', fontSize: '12px' }}>Add speaker, timing, topic, and location.</p>
              </div>
              <button type="button" className="btn-delete" onClick={() => handleRemoveSession(index)}>
                Remove
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Session title</label>
                <input
                  value={session.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="form-input"
                  placeholder="Opening keynote"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Speaker</label>
                <input
                  value={session.speaker || ''}
                  onChange={(e) => handleChange(index, 'speaker', e.target.value)}
                  className="form-input"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Topic</label>
                <input
                  value={session.topic || ''}
                  onChange={(e) => handleChange(index, 'topic', e.target.value)}
                  className="form-input"
                  placeholder="AI, Design Systems, SaaS"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  value={session.location || ''}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  className="form-input"
                  placeholder="Hall A / Main Stage"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start time</label>
                <input
                  type="datetime-local"
                  value={session.startTime}
                  onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">End time</label>
                <input
                  type="datetime-local"
                  value={session.endTime}
                  onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={session.capacity ?? 50}
                  onChange={(e) => handleChange(index, 'capacity', e.target.value)}
                  className="form-input"
                  placeholder="50"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={session.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="form-input"
                  rows={3}
                  placeholder="What will attendees learn in this session?"
                />
              </div>
            </div>
          </div>
        ))
      )}

      <div>
        <button type="button" className="btn-secondary" onClick={handleAddSession}>
          Add Session
        </button>
      </div>
    </div>
  );
}

