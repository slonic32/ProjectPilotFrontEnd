import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import axios from "axios";
import css from "./ProjectDashboard.module.css";

export default function ProjectDashboard() {
  const user = useSelector(selectUser);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    acs: {
      initiating: [""],
      planning: [""],
      executing: [""],
      monitoring: [""],
      closing: [""]
    },
    closed: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);


  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await axios.get("/users/all");
      console.log("Users response:", response.data);
      
      // Access the users array correctly from the response
      if (response.data && response.data.users && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        console.error("Unexpected users data format:", response.data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };
  
  useEffect(() => {
    if (showModal || editMode) {
      fetchUsers();
    }
  }, [showModal, editMode]);
  
  useEffect(() => {
    console.log("Current users list:", users);
  }, [users]);

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

  const fetchProjectDetails = async (projectId) => {
  setLoadingDetails(true);
  try {
    const response = await axios.get(`/projects/${projectId}`);
    setSelectedProject(response.data);
    setShowDetailsModal(true);
  } catch (err) {
    console.error("Failed to fetch project details:", err);
  } finally {
    setLoadingDetails(false);
  }
};
useEffect(() => {
  if (selectedProject) {
    console.log("User PM status:", user);
    console.log("Is user PM?:", user?.pm);
  }
}, [selectedProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

const handleAcsChange = (phase, value, index) => {
  setNewProject(prev => {
    const updatedAcs = { ...prev.acs };
    const phaseActivities = [...updatedAcs[phase]];
    phaseActivities[index] = value;
    updatedAcs[phase] = phaseActivities;
    
    return {
      ...prev,
      acs: updatedAcs
    };
  });
};

const addActivityField = (phase) => {
  setNewProject(prev => {
    const updatedAcs = { ...prev.acs };
    updatedAcs[phase] = [...updatedAcs[phase], ""];
    
    return {
      ...prev,
      acs: updatedAcs
    };
  });
};

const removeActivityField = (phase, index) => {
  setNewProject(prev => {
    const updatedAcs = { ...prev.acs };
    updatedAcs[phase] = updatedAcs[phase].filter((_, i) => i !== index);
    
    return {
      ...prev,
      acs: updatedAcs
    };
  });
};

const handleEnterEditMode = () => {
  setEditedProject({
    name: selectedProject.name,
    closed: selectedProject.closed,
    acs: {
      initiating: selectedProject.acs.initiating.length > 0 
        ? selectedProject.acs.initiating.map(activity => activity._id || "") 
        : [""],
      planning: selectedProject.acs.planning.length > 0 
        ? selectedProject.acs.planning.map(activity => activity._id || "") 
        : [""],
      executing: selectedProject.acs.executing.length > 0 
        ? selectedProject.acs.executing.map(activity => activity._id || "") 
        : [""],
      monitoring: selectedProject.acs.monitoring.length > 0 
        ? selectedProject.acs.monitoring.map(activity => activity._id || "") 
        : [""],
      closing: selectedProject.acs.closing.length > 0 
        ? selectedProject.acs.closing.map(activity => activity._id || "") 
        : [""]
    }
  });
  setEditMode(true);
};

const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  setEditedProject(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleEditCheckboxChange = (e) => {
  const { name, checked } = e.target;
  setEditedProject(prev => ({
    ...prev,
    [name]: checked
  }));
};

const handleEditAcsChange = (phase, value, index) => {
  setEditedProject(prev => {
    const updatedAcs = { ...prev.acs };
    const phaseActivities = [...updatedAcs[phase]];
    phaseActivities[index] = value;
    updatedAcs[phase] = phaseActivities;
    
    return {
      ...prev,
      acs: updatedAcs
    };
  });
};

const addEditActivityField = (phase) => {
  setEditedProject(prev => {
    const updatedAcs = { ...prev.acs };
    updatedAcs[phase] = [...updatedAcs[phase], ""];
    
    return {
      ...prev,
      acs: updatedAcs
    };
  });
};

const removeEditActivityField = (phase, index) => {
  setEditedProject(prev => {
    const updatedAcs = { ...prev.acs };
    updatedAcs[phase] = updatedAcs[phase].filter((_, i) => i !== index);
    
    return {
      ...prev,
      acs: updatedAcs
    };
  });
};

const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setIsSubmitting(true);
    
    const updateData = {
      name: editedProject.name,
      closed: editedProject.closed,
      acs: {
        initiating: editedProject.acs.initiating.filter(item => item.trim() !== ""),
        planning: editedProject.acs.planning.filter(item => item.trim() !== ""),
        executing: editedProject.acs.executing.filter(item => item.trim() !== ""),
        monitoring: editedProject.acs.monitoring.filter(item => item.trim() !== ""),
        closing: editedProject.acs.closing.filter(item => item.trim() !== "")
      }
    };
    
    console.log("Sending update data:", JSON.stringify(updateData));
    
    const response = await axios.patch(`/projects/${selectedProject._id}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Project updated:", response.data);
    
    const updatedProjectResponse = await axios.get(`/projects/${selectedProject._id}`);
    setSelectedProject(updatedProjectResponse.data);
    
    setEditMode(false);
    
    fetchProjects();
    
  } catch (err) {
    console.error("Failed to update project:", err);
    
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response data:", err.response.data);
    } else {
    }
  } finally {
    setIsSubmitting(false);
  }
};

const deleteProject = async (projectId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
  
  if (!confirmDelete) {
    return; 
  }
  
  try {
    setIsSubmitting(true);
    
    await axios.delete(`/projects/${projectId}`);
    
    setShowDetailsModal(false);
    
    setProjects(projects.filter(project => project._id !== projectId));
    
  } catch (err) {
    console.error("Failed to delete project:", err);
    
    if (err.response) {
    } else {
    }
  } finally {
    setIsSubmitting(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setIsSubmitting(true);
    
    const projectData = {
      name: newProject.name,
      acs: {
        initiating: newProject.acs.initiating.filter(item => item.trim() !== ""),
        planning: newProject.acs.planning.filter(item => item.trim() !== ""),
        executing: newProject.acs.executing.filter(item => item.trim() !== ""),
        monitoring: newProject.acs.monitoring.filter(item => item.trim() !== ""),
        closing: newProject.acs.closing.filter(item => item.trim() !== "")
      },
      closed: newProject.closed
    };
    
    console.log("Sending project data:", JSON.stringify(projectData));
    
    const response = await axios.post("/projects/add", projectData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Project created:", response.data);
    
    setNewProject({
      name: "",
      acs: {
        initiating: [""],
        planning: [""],
        executing: [""],
        monitoring: [""],
        closing: [""]
      },
      closed: false
    });
    setShowModal(false);
    
    fetchProjects();
  } catch (err) {
    console.error("Failed to create project:", err);
    
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response data:", err.response.data);
    } else {
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className={css.dashboard}>
      {user.pm && (
        <button className={css.createBtn} onClick={() => setShowModal(true)}>Start New Project</button>
      )}

      <h3 className={css.sectionTitle}>Select Project:</h3>
      
      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className={css.error}>{error}</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className={css.projectList}>
          
{projects.map((proj) => (
  <div 
    key={proj._id} 
    className={css.projectItem}
    onClick={() => fetchProjectDetails(proj._id)}
  >
    <span>{proj.name}</span>
    <span
      className={
        !proj.closed ? css.active : css.closed
      }
    >
      {!proj.closed ? "active" : "closed"}
    </span>
  </div>
))}
        </div>
      )}

      {showModal && (
        <div className={css.modalOverlay}>
          <div className={css.modal}>
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className={css.formGroup}>
                <label>Project Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newProject.name} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <h3>Project Activities</h3>
              
              {/* Initiating Phase */}
                <div className={css.phaseSection}>
                  <h4>Initiating Phase</h4>
                  {newProject.acs.initiating.map((userId, index) => (
                    <div key={`initiating-${index}`} className={css.activityInput}>
                      <select
                        value={userId}
                        onChange={(e) => handleAcsChange("initiating", e.target.value, index)}
                        className={css.userSelect}
                      >
                        <option value="">Select user</option>
                        {users.map(user => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      {newProject.acs.initiating.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeActivityField("initiating", index)}
                          className={css.removeBtn}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addActivityField("initiating")}
                    className={css.addBtn}
                  >
                    Add User
                  </button>
                </div>
              
              {/* Planning Phase */}
                <div className={css.phaseSection}>
                  <h4>Planning Phase</h4>
                  {newProject.acs.planning.map((userId, index) => (
                    <div key={`planning-${index}`} className={css.activityInput}>
                      <select
                        value={userId}
                        onChange={(e) => handleAcsChange("planning", e.target.value, index)}
                        className={css.userSelect}
                      >
                        <option value="">Select user</option>
                        {users.map(user => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      {newProject.acs.planning.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeActivityField("planning", index)}
                          className={css.removeBtn}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addActivityField("planning")}
                    className={css.addBtn}
                  >
                    Add User
                  </button>
                </div>
              
              {/* Executing Phase */}
                  <div className={css.phaseSection}>
                    <h4>Executing Phase</h4>
                    {newProject.acs.executing.map((userId, index) => (
                      <div key={`executing-${index}`} className={css.activityInput}>
                        <select
                          value={userId}
                          onChange={(e) => handleAcsChange("executing", e.target.value, index)}
                          className={css.userSelect}
                        >
                          <option value="">Select user</option>
                          {users.map(user => (
                            <option key={user._id} value={user._id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                        {newProject.acs.executing.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeActivityField("executing", index)}
                            className={css.removeBtn}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addActivityField("executing")}
                      className={css.addBtn}
                    >
                      Add User
                    </button>
                  </div>
              
              {/* Monitoring Phase */}
              <div className={css.phaseSection}>
                <h4>Monitoring Phase</h4>
                {newProject.acs.monitoring.map((userId, index) => (
                  <div key={`monitoring-${index}`} className={css.activityInput}>
                    <select
                      value={userId}
                      onChange={(e) => handleAcsChange("monitoring", e.target.value, index)}
                      className={css.userSelect}
                    >
                      <option value="">Select user</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {newProject.acs.monitoring.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeActivityField("monitoring", index)}
                        className={css.removeBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addActivityField("monitoring")}
                  className={css.addBtn}
                >
                  Add User
                </button>
              </div>
              
              {/* Closing Phase */}
              <div className={css.phaseSection}>
                <h4>Closing Phase</h4>
                {newProject.acs.closing.map((userId, index) => (
                  <div key={`closing-${index}`} className={css.activityInput}>
                    <select
                      value={userId}
                      onChange={(e) => handleAcsChange("closing", e.target.value, index)}
                      className={css.userSelect}
                    >
                      <option value="">Select user</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {newProject.acs.closing.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeActivityField("closing", index)}
                        className={css.removeBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addActivityField("closing")}
                  className={css.addBtn}
                >
                  Add User
                </button>
              </div>
              <div className={css.modalActions}>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className={css.cancelBtn}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={css.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
            </form>
          </div>
        </div>
      )}
{showDetailsModal && selectedProject && (
  <div 
  className={css.modalOverlay}
  onClick={(e) => {
    if (e.target.className === css.modalOverlay) {
      setShowDetailsModal(false);
      setEditMode(false);
    }
  }}
>
    <div className={css.modal}>
      {loadingDetails ? (
        <p>Loading project details...</p>
      ) : (
        <>
          <h2>{editMode ? "Edit Project" : "Project Details"}</h2>
          
          {!editMode ? (
            <>
              <div className={css.projectDetails}>
                <h3>{selectedProject.name}</h3>
                <p><strong>Start Date:</strong> {selectedProject.startDate}</p>
                <p><strong>Status:</strong> {selectedProject.closed ? "Closed" : "Active"}</p>
                
                <div className={css.pmDetails}>
                  <h4>Project Manager</h4>
                  <p>
                    {selectedProject.pm.name} ({selectedProject.pm.email})
                  </p>
                </div>
                
                <h4>Project Activities</h4>
                
                {Object.entries(selectedProject.acs).map(([phase, activities]) => (
                  <div key={phase} className={css.phaseDetails}>
                    <h5>{phase.charAt(0).toUpperCase() + phase.slice(1)} Phase</h5>
                    {activities.length === 0 ? (
                      <p>No activities in this phase</p>
                    ) : (
                      <ul>
                        {activities.map((activity) => (
                          <li key={activity._id}>
                            {activity.name} ({activity.email})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              
              <div className={css.modalActions}>
                <button 
                  className={css.updateBtn}
                  onClick={handleEnterEditMode}
                  disabled={isSubmitting}
                >
                  Update Project
                </button>
                <button 
                  className={css.deleteBtn}
                  onClick={() => deleteProject(selectedProject._id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Delete Project"}
                </button>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className={css.closeBtn}
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateSubmit}>
              <div className={css.formGroup}>
                <label>Project Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editedProject.name} 
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              
              <h4>Update Project Activities</h4>
              
              {/* Initiating Phase */}
              <div className={css.phaseSection}>
              <h5>Initiating Phase</h5>
              {editedProject.acs.initiating.map((userId, index) => (
                <div key={`edit-initiating-${index}`} className={css.activityInput}>
                  <select
                    value={userId}
                    onChange={(e) => handleEditAcsChange("initiating", e.target.value, index)}
                    className={css.userSelect}
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {editedProject.acs.initiating.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEditActivityField("initiating", index)}
                      className={css.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addEditActivityField("initiating")}
                className={css.addBtn}
              >
                Add User
              </button>
            </div>
              
              {/* Planning Phase */}
              <div className={css.phaseSection}>
              <h5>Planning Phase</h5>
              {editedProject.acs.planning.map((userId, index) => (
                <div key={`edit-planning-${index}`} className={css.activityInput}>
                  <select
                    value={userId}
                    onChange={(e) => handleEditAcsChange("planning", e.target.value, index)}
                    className={css.userSelect}
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {editedProject.acs.planning.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEditActivityField("planning", index)}
                      className={css.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addEditActivityField("planning")}
                className={css.addBtn}
              >
                Add User
              </button>
            </div>
              
              {/* Executing Phase */}
              <div className={css.phaseSection}>
              <h5>Executing Phase</h5>
              {editedProject.acs.executing.map((userId, index) => (
                <div key={`edit-executing-${index}`} className={css.activityInput}>
                  <select
                    value={userId}
                    onChange={(e) => handleEditAcsChange("executing", e.target.value, index)}
                    className={css.userSelect}
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {editedProject.acs.executing.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEditActivityField("executing", index)}
                      className={css.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addEditActivityField("executing")}
                className={css.addBtn}
              >
                Add User
              </button>
            </div>
              
              {/* Monitoring Phase */}
              <div className={css.phaseSection}>
              <h5>Monitoring Phase</h5>
              {editedProject.acs.monitoring.map((userId, index) => (
                <div key={`edit-monitoring-${index}`} className={css.activityInput}>
                  <select
                    value={userId}
                    onChange={(e) => handleEditAcsChange("monitoring", e.target.value, index)}
                    className={css.userSelect}
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {editedProject.acs.monitoring.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEditActivityField("monitoring", index)}
                      className={css.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addEditActivityField("monitoring")}
                className={css.addBtn}
              >
                Add User
              </button>
            </div>
              
              {/* Closing Phase */}
              <div className={css.phaseSection}>
              <h5>Closing Phase</h5>
              {editedProject.acs.closing.map((userId, index) => (
                <div key={`edit-closing-${index}`} className={css.activityInput}>
                  <select
                    value={userId}
                    onChange={(e) => handleEditAcsChange("closing", e.target.value, index)}
                    className={css.userSelect}
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {editedProject.acs.closing.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEditActivityField("closing", index)}
                      className={css.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addEditActivityField("closing")}
                className={css.addBtn}
              >
                Add User
              </button>
            </div>
              
              <div className={css.modalActions}>
                <button 
                  type="button" 
                  onClick={() => setEditMode(false)}
                  className={css.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={css.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
}