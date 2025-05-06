import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import css from './ProjectFileTree.module.css';

// Modal components
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={css.modalOverlay}>
      <div className={css.modal}>
        <div className={css.modalHeader}>
          <h3>{title}</h3>
          <button onClick={onClose} className={css.closeButton}>×</button>
        </div>
        <div className={css.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ProjectFileTree() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});
  
  // Modal states
  const [closeProjectModal, setCloseProjectModal] = useState(false);
  const [stakeholdersModal, setStakeholdersModal] = useState(false);
  const [charterModal, setCharterModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Form states
  const [closeProjectForm, setCloseProjectForm] = useState({
    closed: true,
    closedDate: new Date().toISOString().split('T')[0]
  });
  
  const [stakeholdersForm, setStakeholdersForm] = useState({
    identification: ["Product Owner", "Legal Advisor", "IT Consultant"],
    assessment: ["High Influence", "Needs access to weekly reports"],
    classification: ["Internal", "External", "Keep Satisfied", "Monitor Closely"]
  });
  
  const [charterForm, setCharterForm] = useState({
    projectTitle: "",
    purpose: "",
    description: "",
    objective: "",
    successCriteria: "",
    sponsors: [""],
    majorDeliverables: "",
    acceptanceCriteria: "",
    milestone_schedule: [{ date: new Date().toISOString().split('T')[0], title: "" }],
    keyAssumptions: "",
    constraints: "",
    majorRisks: "",
    reportingRequirements: "",
    approvalSignature: true,
    approvalDate: new Date().toISOString().split('T')[0]
  });

  // Fetch all projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/projects/all");
      setProjects(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle project expansion
  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Toggle phase expansion
  const togglePhase = (projectId, phase) => {
    const key = `${projectId}-${phase}`;
    setExpandedPhases(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Open close project modal
  const openCloseProjectModal = (projectId) => {
    setSelectedProjectId(projectId);
    setCloseProjectModal(true);
  };

  // Open identify stakeholders modal
  const openStakeholdersModal = (projectId) => {
    setSelectedProjectId(projectId);
    setStakeholdersModal(true);
  };

  // Open develop project charter modal
  const openCharterModal = (projectId) => {
    setSelectedProjectId(projectId);
    setCharterModal(true);
  };

  // Handle close project action
  const handleCloseProject = async () => {
    try {
      await axios.patch(`/projects/${selectedProjectId}/closing/integration/closeProject`, closeProjectForm);
      setCloseProjectModal(false);
      fetchProjects();
      alert("Project successfully closed!");
    } catch (error) {
      console.error("Failed to close project:", error);
      alert("Failed to close project. Please try again.");
    }
  };

  // Handle identify stakeholders action
  const handleIdentifyStakeholders = async () => {
    try {
      await axios.patch(`/projects/${selectedProjectId}/initiating/stakeholder/identifyStakeholders`, stakeholdersForm);
      setStakeholdersModal(false);
      alert("Stakeholder registry updated successfully!");
    } catch (error) {
      console.error("Failed to update stakeholders:", error);
      alert("Failed to update stakeholders. Please try again.");
    }
  };

  // Handle develop project charter action
  const handleDevelopCharter = async () => {
    try {
      await axios.patch(`/projects/${selectedProjectId}/initiating/integration/developProjectCharter`, charterForm);
      setCharterModal(false);
      alert("Project charter updated successfully!");
    } catch (error) {
      console.error("Failed to update project charter:", error);
      alert("Failed to update project charter. Please try again.");
    }
  };

  // Update form state handlers
  const handleCloseProjectFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCloseProjectForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStakeholdersFormChange = (field, index, value) => {
    setStakeholdersForm(prev => {
      const newData = { ...prev };
      if (index !== undefined) {
        newData[field][index] = value;
      } else {
        newData[field] = value;
      }
      return newData;
    });
  };

  const handleCharterFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCharterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setCharterForm(prev => {
      const newMilestones = [...prev.milestone_schedule];
      newMilestones[index] = {
        ...newMilestones[index],
        [field]: value
      };
      return {
        ...prev,
        milestone_schedule: newMilestones
      };
    });
  };

  const addMilestone = () => {
    setCharterForm(prev => ({
      ...prev,
      milestone_schedule: [
        ...prev.milestone_schedule,
        { date: new Date().toISOString().split('T')[0], title: "" }
      ]
    }));
  };

  const removeMilestone = (index) => {
    setCharterForm(prev => {
      const newMilestones = [...prev.milestone_schedule];
      newMilestones.splice(index, 1);
      return {
        ...prev,
        milestone_schedule: newMilestones
      };
    });
  };

  const addSponsor = () => {
    setCharterForm(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, ""]
    }));
  };

  const removeSponsor = (index) => {
    setCharterForm(prev => {
      const newSponsors = [...prev.sponsors];
      newSponsors.splice(index, 1);
      return {
        ...prev,
        sponsors: newSponsors
      };
    });
  };

  const handleSponsorChange = (index, value) => {
    setCharterForm(prev => {
      const newSponsors = [...prev.sponsors];
      newSponsors[index] = value;
      return {
        ...prev,
        sponsors: newSponsors
      };
    });
  };

  if (loading) return <div className={css.loading}>Loading projects...</div>;
  if (error) return <div className={css.error}>{error}</div>;
  if (projects.length === 0) return <div className={css.empty}>No projects found.</div>;

  return (
    <div className={css.treeContainer}>
      <h2 className={css.treeTitle}>Project Structure</h2>
      <div className={css.tree}>
        {projects.map(project => (
          <div key={project._id} className={css.projectItem}>
            <div 
              className={css.projectNode}
              onClick={() => toggleProject(project._id)}
            >
              {expandedProjects[project._id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={18} className={css.icon} />
              <span className={project.closed ? css.closedProject : css.activeProject}>
                {project.name} {project.closed ? "(Closed)" : ""}
              </span>
            </div>
            
            {/* Project Phases */}
            {expandedProjects[project._id] && (
              <div className={css.phaseContainer}>
                {/* Initiating Phase */}
                <div className={css.phaseItem}>
                  <div 
                    className={css.phaseNode}
                    onClick={() => togglePhase(project._id, 'initiating')}
                  >
                    {expandedPhases[`${project._id}-initiating`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Folder size={16} className={css.icon} />
                    <span>Initiating Phase</span>
                  </div>
                  
                  {/* Initiating Phase Actions */}
                  {expandedPhases[`${project._id}-initiating`] && (
                    <div className={css.actionContainer}>
                      <div 
                        className={css.actionItem}
                        onClick={() => openStakeholdersModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Identify Stakeholders</span>
                      </div>
                      <div 
                        className={css.actionItem}
                        onClick={() => openCharterModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Develop Project Charter</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Closing Phase */}
                <div className={css.phaseItem}>
                  <div 
                    className={css.phaseNode}
                    onClick={() => togglePhase(project._id, 'closing')}
                  >
                    {expandedPhases[`${project._id}-closing`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Folder size={16} className={css.icon} />
                    <span>Closing Phase</span>
                  </div>
                  
                  {/* Closing Phase Actions */}
                  {expandedPhases[`${project._id}-closing`] && (
                    <div className={css.actionContainer}>
                      <div 
                        className={css.actionItem}
                        onClick={() => openCloseProjectModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Close Project</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Close Project Modal */}
      <Modal 
        isOpen={closeProjectModal} 
        onClose={() => setCloseProjectModal(false)} 
        title="Close Project"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCloseProject(); }}>
          <div className={css.formGroup}>
            <label>
              <input 
                type="checkbox" 
                name="closed" 
                checked={closeProjectForm.closed} 
                onChange={handleCloseProjectFormChange} 
              />
              Mark as closed
            </label>
          </div>
          <div className={css.formGroup}>
            <label>Closed Date</label>
            <input 
              type="date" 
              name="closedDate" 
              value={closeProjectForm.closedDate} 
              onChange={handleCloseProjectFormChange} 
              required
            />
          </div>
          <div className={css.modalActions}>
            <button type="button" onClick={() => setCloseProjectModal(false)}>Cancel</button>
            <button type="submit" className={css.primaryButton}>Close Project</button>
          </div>
        </form>
      </Modal>

      {/* Identify Stakeholders Modal */}
      <Modal 
        isOpen={stakeholdersModal} 
        onClose={() => setStakeholdersModal(false)} 
        title="Identify Stakeholders"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleIdentifyStakeholders(); }}>
          <div className={css.formGroup}>
            <h4>Identification</h4>
            {stakeholdersForm.identification.map((item, index) => (
              <div key={`identification-${index}`} className={css.arrayInput}>
                <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => handleStakeholdersFormChange('identification', index, e.target.value)} 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => {
                    const newIdentification = [...stakeholdersForm.identification];
                    newIdentification.splice(index, 1);
                    setStakeholdersForm({...stakeholdersForm, identification: newIdentification});
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => setStakeholdersForm({
                ...stakeholdersForm, 
                identification: [...stakeholdersForm.identification, ""]
              })}
            >
              Add Identification
            </button>
          </div>

          <div className={css.formGroup}>
            <h4>Assessment</h4>
            {stakeholdersForm.assessment.map((item, index) => (
              <div key={`assessment-${index}`} className={css.arrayInput}>
                <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => handleStakeholdersFormChange('assessment', index, e.target.value)} 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => {
                    const newAssessment = [...stakeholdersForm.assessment];
                    newAssessment.splice(index, 1);
                    setStakeholdersForm({...stakeholdersForm, assessment: newAssessment});
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => setStakeholdersForm({
                ...stakeholdersForm, 
                assessment: [...stakeholdersForm.assessment, ""]
              })}
            >
              Add Assessment
            </button>
          </div>

          <div className={css.formGroup}>
            <h4>Classification</h4>
            {stakeholdersForm.classification.map((item, index) => (
              <div key={`classification-${index}`} className={css.arrayInput}>
                <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => handleStakeholdersFormChange('classification', index, e.target.value)} 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => {
                    const newClassification = [...stakeholdersForm.classification];
                    newClassification.splice(index, 1);
                    setStakeholdersForm({...stakeholdersForm, classification: newClassification});
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => setStakeholdersForm({
                ...stakeholdersForm, 
                classification: [...stakeholdersForm.classification, ""]
              })}
            >
              Add Classification
            </button>
          </div>

          <div className={css.modalActions}>
            <button type="button" onClick={() => setStakeholdersModal(false)}>Cancel</button>
            <button type="submit" className={css.primaryButton}>Update Stakeholders</button>
          </div>
        </form>
      </Modal>

      {/* Project Charter Modal */}
      <Modal 
        isOpen={charterModal} 
        onClose={() => setCharterModal(false)} 
        title="Develop Project Charter"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleDevelopCharter(); }}>
          <div className={css.formGroup}>
            <label>Project Title</label>
            <input 
              type="text" 
              name="projectTitle" 
              value={charterForm.projectTitle} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Purpose</label>
            <textarea 
              name="purpose" 
              value={charterForm.purpose} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Description</label>
            <textarea 
              name="description" 
              value={charterForm.description} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Objective</label>
            <textarea 
              name="objective" 
              value={charterForm.objective} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Success Criteria</label>
            <textarea 
              name="successCriteria" 
              value={charterForm.successCriteria} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <h4>Sponsors</h4>
            {charterForm.sponsors.map((sponsor, index) => (
              <div key={`sponsor-${index}`} className={css.arrayInput}>
                <input 
                  type="text" 
                  value={sponsor} 
                  onChange={(e) => handleSponsorChange(index, e.target.value)} 
                  required
                />
                {charterForm.sponsors.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeSponsor(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSponsor}>Add Sponsor</button>
          </div>
          
          <div className={css.formGroup}>
            <label>Major Deliverables</label>
            <textarea 
              name="majorDeliverables" 
              value={charterForm.majorDeliverables} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Acceptance Criteria</label>
            <textarea 
              name="acceptanceCriteria" 
              value={charterForm.acceptanceCriteria} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <h4>Milestone Schedule</h4>
            {charterForm.milestone_schedule.map((milestone, index) => (
              <div key={`milestone-${index}`} className={css.milestoneInput}>
                <div>
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={milestone.date} 
                    onChange={(e) => handleMilestoneChange(index, 'date', e.target.value)} 
                    required
                  />
                </div>
                <div>
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={milestone.title} 
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)} 
                    required
                  />
                </div>
                {charterForm.milestone_schedule.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeMilestone(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addMilestone}>Add Milestone</button>
          </div>
          
          <div className={css.formGroup}>
            <label>Key Assumptions</label>
            <textarea 
              name="keyAssumptions" 
              value={charterForm.keyAssumptions} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Constraints</label>
            <textarea 
              name="constraints" 
              value={charterForm.constraints} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Major Risks</label>
            <textarea 
              name="majorRisks" 
              value={charterForm.majorRisks} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Reporting Requirements</label>
            <textarea 
              name="reportingRequirements" 
              value={charterForm.reportingRequirements} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>
              <input 
                type="checkbox" 
                name="approvalSignature" 
                checked={charterForm.approvalSignature} 
                onChange={handleCharterFormChange} 
              />
              Approval Signature
            </label>
          </div>
          
          <div className={css.formGroup}>
            <label>Approval Date</label>
            <input 
              type="date" 
              name="approvalDate" 
              value={charterForm.approvalDate} 
              onChange={handleCharterFormChange} 
              required
            />
          </div>
          
          <div className={css.modalActions}>
            <button type="button" onClick={() => setCharterModal(false)}>Cancel</button>
            <button type="submit" className={css.primaryButton}>Update Project Charter</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}