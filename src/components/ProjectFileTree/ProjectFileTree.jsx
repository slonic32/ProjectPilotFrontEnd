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

  const [scopeManagementModal, setScopeManagementModal] = useState(false);
  const [scopeManagementForm, setScopeManagementForm] = useState({
    scopeManagementPlan: {
      projectScopeStatement: "",
      WBS: "",
      scopeBaseline: "",
      projectDeliverables: ""
    },
    requirementsManagementPlan: {
      requirementActivities: "",
      changesManagedApproved: "",
      requirementPrioritised: "",
      metricsUsed: ""
    }
  });

    const [collectRequirementsModal, setCollectRequirementsModal] = useState(false);
    const [collectRequirementsForm, setCollectRequirementsForm] = useState({
      requirements: [
        { requirement: "", documentation: "" }
      ]
    });

    // Add these with your other state variables
const [newDeliverable, setNewDeliverable] = useState({ name: "", description: "" });
const [availableDeliverables, setAvailableDeliverables] = useState([]);

    const [defineScopeModal, setDefineScopeModal] = useState(false);
    const [defineScopeForm, setDefineScopeForm] = useState({
  endProductScopeDescription: "",
  deliverables: [], // This will store deliverable IDs instead of strings
  acceptanceCriteria: [""],
  exclusions: [""]
});

    // Update wbsForm state
const [wbsForm, setWbsForm] = useState({
  WBS: [] // This will store IDs of work items instead of strings
});
const [createWBSModal, setCreateWBSModal] = useState(false);

// Add these new state variables with your other state variables
const [newWorkItem, setNewWorkItem] = useState({
  name: "",
  description: "",
  work: [],
  deliverable: "",
  project: "" // This will be set when creating the item
});

const [availableWorkItems, setAvailableWorkItems] = useState([]);

const [scheduleManagementModal, setScheduleManagementModal] = useState(false);
const [scheduleManagementForm, setScheduleManagementForm] = useState({
  scheduleManagementPlan: {
    changeOfSchedule: "",
    levelOfDetail: "",
    dependencies: "",
    unitsOfMeasure: "",
    requestsForChanges: ""
  }
});

const [costManagementModal, setCostManagementModal] = useState(false);
const [costManagementForm, setCostManagementForm] = useState({
  costManagementPlan: {
    units: [""],
    precision: [""],
    ranges: [""],
    rules: [""],
    reportingFormatsFrequency: [""]
  }
});


const [availableActivities, setAvailableActivities] = useState([]);
const [newActivity, setNewActivity] = useState({
  workPackage: "",
  name: "",
  initialScopeDescription: "",
  detailedScopeDescription: "",
  predecessorActivities: [],
  resourceRequirements: [],
  duration: 0,
  project: ""
});

const [costEstimateModal, setCostEstimateModal] = useState(false);
const [costEstimateForm, setCostEstimateForm] = useState({
  costEstimates: [
    {
      activityId: "", // Store the activity ID instead of embedding activity data
      labor: [{ name: "", cost: 0 }],
      materials: [{ name: "", cost: 0 }],
      equipment: [{ name: "", cost: 0 }],
      facilities: [{ name: "", cost: 0 }],
      subcontractor: [{ name: "", cost: 0 }],
      travel: [{ name: "", cost: 0 }],
      reserve: [{ name: "", cost: 0 }],
      costOfActivity: 0
    }
  ]
});

// Fetch activities when opening the modal
const openCostEstimateModal = async (projectId) => {
  setSelectedProjectId(projectId);
  setCostEstimateModal(true);
  await fetchActivities(projectId);
  await fetchWorkItems(projectId); 
};

// Function to fetch activities
const fetchActivities = async (projectId) => {
  try {
    const response = await axios.get(`/activities/${projectId}`);
    // Make sure we always have an array
    const activitiesArray = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.activities || []);
    
    console.log("Activities data:", response.data); // For debugging
    setAvailableActivities(activitiesArray);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    alert("Failed to fetch activities. Please try again.");
    // Make sure we have an empty array on error
    setAvailableActivities([]);
  }
};

// Function to create a new activity
const createActivity = async () => {
  if (!newActivity.name.trim()) {
    alert("Activity name is required");
    return;
  }

  if (!newActivity.workPackage) {
    alert("Work package is required");
    return;
  }
  
  try {
    const activityData = {
      ...newActivity,
      project: selectedProjectId
    };
    
    const response = await axios.post('/activities', activityData);
    console.log("Created activity:", response.data);
    
    // Add new activity to available activities
    setAvailableActivities(prev => [...prev, response.data]);
    
    // Reset new activity form
    setNewActivity({
      workPackage: "",
      name: "",
      initialScopeDescription: "",
      detailedScopeDescription: "",
      predecessorActivities: [],
      resourceRequirements: [],
      duration: 0,
      project: ""
    });
    
    alert("Activity created successfully!");
  } catch (error) {
    console.error("Failed to create activity:", error);
    alert("Failed to create activity. Please try again.");
  }
};

// Function to delete an activity
const deleteActivity = async (activityId) => {
  try {
    await axios.delete(`/activities/${activityId}`);
    
    // Remove from available activities
    setAvailableActivities(prev => prev.filter(a => a._id !== activityId));
    
    // Remove from cost estimates if it's there
    setCostEstimateForm(prev => ({
      ...prev,
      costEstimates: prev.costEstimates.filter(estimate => estimate.activityId !== activityId)
    }));
    
  } catch (error) {
    console.error("Failed to delete activity:", error);
    alert("Failed to delete activity. Please try again.");
  }
};

const handleNewActivityChange = (field, value) => {
  setNewActivity(prev => ({
    ...prev,
    [field]: value
  }));
};

// Update the handle changes to activity selection
const handleActivitySelection = (estimateIndex, activityId) => {
  setCostEstimateForm(prev => {
    const newEstimates = [...prev.costEstimates];
    newEstimates[estimateIndex].activityId = activityId;
    return {
      ...prev,
      costEstimates: newEstimates
    };
  });
};

// Modified estimate cost function to work with activity IDs
const handleEstimateCost = async () => {
  try {
    // Calculate total costs for each activity before submitting
    const formData = {
      costEstimates: costEstimateForm.costEstimates.map(estimate => {
        const laborCost = estimate.labor.reduce((sum, item) => sum + Number(item.cost), 0);
        const materialsCost = estimate.materials.reduce((sum, item) => sum + Number(item.cost), 0);
        const equipmentCost = estimate.equipment.reduce((sum, item) => sum + Number(item.cost), 0);
        const facilitiesCost = estimate.facilities.reduce((sum, item) => sum + Number(item.cost), 0);
        const subcontractorCost = estimate.subcontractor.reduce((sum, item) => sum + Number(item.cost), 0);
        const travelCost = estimate.travel.reduce((sum, item) => sum + Number(item.cost), 0);
        const reserveCost = estimate.reserve.reduce((sum, item) => sum + Number(item.cost), 0);
        
        const totalCost = laborCost + materialsCost + equipmentCost + 
                        facilitiesCost + subcontractorCost + travelCost + reserveCost;
        
        return {
          ...estimate,
          costOfActivity: totalCost
        };
      })
    };

    await axios.patch(
      `/projects/${selectedProjectId}/planning/cost/estimateCost`,
      formData
    );
    setCostEstimateModal(false);
    alert("Cost estimates updated successfully!");
  } catch (error) {
    console.error("Failed to update cost estimates:", error);
    console.error("Error details:", error.response?.data);
    alert("Failed to update cost estimates. Please try again.");
  }
};

// Remove a cost estimate
const removeEstimate = (estimateIndex) => {
  setCostEstimateForm(prev => {
    const newEstimates = [...prev.costEstimates];
    newEstimates.splice(estimateIndex, 1);
    return {
      ...prev,
      costEstimates: newEstimates
    };
  });
};

const [determineBudgetModal, setDetermineBudgetModal] = useState(false);
const [determineBudgetForm, setDetermineBudgetForm] = useState({
  costBaseline: 0,
  projectFundingRequirements: [
    { period: "", cost: 0 }
  ]
});

const [resourceManagementModal, setResourceManagementModal] = useState(false);
const [resourceManagementForm, setResourceManagementForm] = useState({
  resourceManagementPlan: {
    identified: "",
    obtained: "",
    roles: "",
    training: "",
    ensured: ""
  }
});

const [estimateResourceModal, setEstimateResourceModal] = useState(false);
const [estimateResourceForm, setEstimateResourceForm] = useState({
  resourceRequireMents: [
    {
      timePeriod: "",
      resource: "",
      expectedUse: 0,
      units: ""
    }
  ],
  basisOfEstimates: ""
});

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



// Open scope management modal
const openScopeManagementModal = (projectId) => {
  setSelectedProjectId(projectId);
  setScopeManagementModal(true);
};

// Handle plan scope management action
const handlePlanScopeManagement = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/scope/planScopeManagement`,
      scopeManagementForm
    );
    setScopeManagementModal(false);
    alert("Scope management plan updated successfully!");
  } catch (error) {
    console.error("Failed to update scope management plan:", error);
    alert("Failed to update scope management plan. Please try again.");
  }
};

// Handle scope management form changes
const handleScopeManagementFormChange = (section, field, value) => {
  setScopeManagementForm(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value
    }
  }));
};

const openCollectRequirementsModal = (projectId) => {
  setSelectedProjectId(projectId);
  setCollectRequirementsModal(true);
};

const handleCollectRequirements = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/scope/collectRequirements`,
      collectRequirementsForm
    );
    setCollectRequirementsModal(false);
    alert("Requirements collected successfully!");
  } catch (error) {
    console.error("Failed to collect requirements:", error);
    alert("Failed to collect requirements. Please try again.");
  }
};

const handleRequirementChange = (index, field, value) => {
  setCollectRequirementsForm(prev => {
    const newRequirements = [...prev.requirements];
    newRequirements[index] = {
      ...newRequirements[index],
      [field]: value
    };
    return {
      ...prev,
      requirements: newRequirements
    };
  });
};

const addRequirement = () => {
  setCollectRequirementsForm(prev => ({
    ...prev,
    requirements: [
      ...prev.requirements,
      { requirement: "", documentation: "" }
    ]
  }));
};

const removeRequirement = (index) => {
  setCollectRequirementsForm(prev => {
    const newRequirements = [...prev.requirements];
    newRequirements.splice(index, 1);
    return {
      ...prev,
      requirements: newRequirements
    };
  });
};

// Add this function to fetch deliverables when opening the modal
const fetchProjectDeliverables = async (projectId) => {
  try {
    const response = await axios.get(`/deliverables/all/${projectId}`);
    setAvailableDeliverables(response.data || []);
  } catch (error) {
    console.error("Failed to fetch deliverables:", error);
  }
};

// Update the openDefineScopeModal function to fetch deliverables
const openDefineScopeModal = (projectId) => {
  setSelectedProjectId(projectId);
  setDefineScopeModal(true);
  fetchProjectDeliverables(projectId); // Add this line
};

// Add function to create a new deliverable
const createDeliverable = async () => {
  if (!newDeliverable.name.trim()) {
    alert("Deliverable name is required");
    return;
  }
  
  try {
    const response = await axios.post('/deliverables/add', {
      name: newDeliverable.name,
      description: newDeliverable.description,
      project: selectedProjectId
    });
    
    // Add new deliverable to available list
    setAvailableDeliverables(prev => [...prev, response.data]);
    
    // Clear form
    setNewDeliverable({ name: "", description: "" });
  } catch (error) {
    console.error("Failed to create deliverable:", error);
    alert("Failed to create deliverable. Please try again.");
  }
};

// Add function to toggle deliverable selection
const toggleDeliverable = (deliverableId) => {
  setDefineScopeForm(prev => {
    if (prev.deliverables.includes(deliverableId)) {
      return {
        ...prev,
        deliverables: prev.deliverables.filter(id => id !== deliverableId)
      };
    } else {
      return {
        ...prev,
        deliverables: [...prev.deliverables, deliverableId]
      };
    }
  });
};

// Add function to delete a deliverable
const deleteDeliverable = async (deliverableId) => {
  try {
    await axios.delete(`/deliverables/${deliverableId}`);
    
    // Remove from available list
    setAvailableDeliverables(prev => prev.filter(d => d._id !== deliverableId));
    
    // Remove from selected if it's selected
    setDefineScopeForm(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter(id => id !== deliverableId)
    }));
  } catch (error) {
    console.error("Failed to delete deliverable:", error);
    alert("Failed to delete deliverable. Please try again.");
  }
};

// Add handler for new deliverable form
const handleNewDeliverableChange = (field, value) => {
  setNewDeliverable(prev => ({
    ...prev,
    [field]: value
  }));
};

const handleDefineScope = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/scope/defineScope`,
      defineScopeForm
    );
    setDefineScopeModal(false);
    alert("Scope definition updated successfully!");
  } catch (error) {
    console.error("Failed to update scope definition:", error);
    alert("Failed to update scope definition. Please try again.");
  }
};

// Handle text field changes
const handleDefineScopeTextChange = (e) => {
  setDefineScopeForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

// Handle array item changes
const handleDefineScopeArrayChange = (field, index, value) => {
  setDefineScopeForm(prev => {
    const newArray = [...prev[field]];
    newArray[index] = value;
    return {
      ...prev,
      [field]: newArray
    };
  });
};

// Add item to array
const addDefineScopeItem = (field) => {
  setDefineScopeForm(prev => ({
    ...prev,
    [field]: [...prev[field], ""]
  }));
};

// Remove item from array
const removeDefineScopeItem = (field, index) => {
  setDefineScopeForm(prev => {
    const newArray = [...prev[field]];
    newArray.splice(index, 1);
    return {
      ...prev,
      [field]: newArray
    };
  });
};

// Add this function to fetch work items when opening the modal
const fetchWorkItems = async (projectId) => {
  try {
    const response = await axios.get(`/works/all/${projectId}`);
    setAvailableWorkItems(response.data || []);
  } catch (error) {
    console.error("Failed to fetch work items:", error);
  }
};

// Update the openCreateWBSModal function to fetch both deliverables and work items
const openCreateWBSModal = (projectId) => {
  setSelectedProjectId(projectId);
  setCreateWBSModal(true);
  fetchProjectDeliverables(projectId); // Reuse existing function
  fetchWorkItems(projectId);
};

// Add function to create a new work item
const createWorkItem = async () => {
  if (!newWorkItem.name.trim()) {
    alert("Work item name is required");
    return;
  }
  
  try {
    const response = await axios.post('/works/add', {
      name: newWorkItem.name,
      description: newWorkItem.description,
      project: selectedProjectId,
      work: newWorkItem.work.length > 0 ? newWorkItem.work : undefined,
      deliverable: newWorkItem.deliverable || undefined
    });
    
    // Add new work item to available list
    setAvailableWorkItems(prev => [...prev, response.data]);
    
    // Clear form
    setNewWorkItem({ name: "", description: "", work: [], deliverable: "" });
  } catch (error) {
    console.error("Failed to create work item:", error);
    alert("Failed to create work item. Please try again.");
  }
};

// Add function to delete a work item
const deleteWorkItem = async (workId) => {
  try {
    await axios.delete(`/works/${workId}`);
    
    // Remove from available list
    setAvailableWorkItems(prev => prev.filter(w => w._id !== workId));
    
    // Remove from selected WBS if it's there
    setWbsForm(prev => ({
      ...prev,
      WBS: prev.WBS.filter(id => id !== workId)
    }));
  } catch (error) {
    console.error("Failed to delete work item:", error);
    alert("Failed to delete work item. Please try again.");
  }
};

// Handle changes to new work item form
const handleNewWorkItemChange = (field, value) => {
  setNewWorkItem(prev => ({
    ...prev,
    [field]: value
  }));
};

// Toggle work item for parent selection
const toggleParentWork = (workId) => {
  setNewWorkItem(prev => {
    if (prev.work.includes(workId)) {
      return {
        ...prev,
        work: prev.work.filter(id => id !== workId)
      };
    } else {
      return {
        ...prev,
        work: [...prev.work, workId]
      };
    }
  });
};

// Toggle work item for WBS selection
const toggleWbsSelection = (workId) => {
  setWbsForm(prev => {
    if (prev.WBS.includes(workId)) {
      return {
        ...prev,
        WBS: prev.WBS.filter(id => id !== workId)
      };
    } else {
      return {
        ...prev,
        WBS: [...prev.WBS, workId]
      };
    }
  });
};

// Update the handleCreateWBS function
const handleCreateWBS = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/scope/createWBS`,
      wbsForm
    );
    setCreateWBSModal(false);
    alert("WBS created successfully!");
  } catch (error) {
    console.error("Failed to create WBS:", error);
    alert("Failed to create WBS. Please try again.");
  }
};

const handleWBSItemChange = (index, value) => {
  setWbsForm(prev => {
    const newWBS = [...prev.WBS];
    newWBS[index] = value;
    return {
      ...prev,
      WBS: newWBS
    };
  });
};

const addWBSItem = () => {
  setWbsForm(prev => ({
    ...prev,
    WBS: [...prev.WBS, ""]
  }));
};

const removeWBSItem = (index) => {
  setWbsForm(prev => {
    const newWBS = [...prev.WBS];
    newWBS.splice(index, 1);
    return {
      ...prev,
      WBS: newWBS
    };
  });
};

const openScheduleManagementModal = (projectId) => {
  setSelectedProjectId(projectId);
  setScheduleManagementModal(true);
};

const handlePlanScheduleManagement = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/schedule/planScheduleManagement`,
      scheduleManagementForm
    );
    setScheduleManagementModal(false);
    alert("Schedule management plan updated successfully!");
  } catch (error) {
    console.error("Failed to update schedule management plan:", error);
    alert("Failed to update schedule management plan. Please try again.");
  }
};

const handleScheduleManagementFormChange = (field, value) => {
  setScheduleManagementForm(prev => ({
    ...prev,
    scheduleManagementPlan: {
      ...prev.scheduleManagementPlan,
      [field]: value
    }
  }));
};

const openCostManagementModal = (projectId) => {
  setSelectedProjectId(projectId);
  setCostManagementModal(true);
};

const handlePlanCostManagement = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/cost/planCostManagement`,
      costManagementForm
    );
    setCostManagementModal(false);
    alert("Cost management plan updated successfully!");
  } catch (error) {
    console.error("Failed to update cost management plan:", error);
    alert("Failed to update cost management plan. Please try again.");
  }
};

const handleCostManagementArrayChange = (field, index, value) => {
  setCostManagementForm(prev => ({
    ...prev,
    costManagementPlan: {
      ...prev.costManagementPlan,
      [field]: prev.costManagementPlan[field].map((item, i) => i === index ? value : item)
    }
  }));
};

const addCostManagementItem = (field) => {
  setCostManagementForm(prev => ({
    ...prev,
    costManagementPlan: {
      ...prev.costManagementPlan,
      [field]: [...prev.costManagementPlan[field], ""]
    }
  }));
};

const removeCostManagementItem = (field, index) => {
  setCostManagementForm(prev => {
    const newArray = [...prev.costManagementPlan[field]];
    newArray.splice(index, 1);
    return {
      ...prev,
      costManagementPlan: {
        ...prev.costManagementPlan,
        [field]: newArray
      }
    };
  });
};



// Handle changes to activity name
const handleActivityChange = (activityIndex, value) => {
  setCostEstimateForm(prev => {
    const newEstimates = [...prev.costEstimates];
    newEstimates[activityIndex].activity = value;
    return {
      ...prev,
      costEstimates: newEstimates
    };
  });
};

// Handle changes to cost items
const handleCostItemChange = (activityIndex, category, itemIndex, field, value) => {
  setCostEstimateForm(prev => {
    const newEstimates = [...prev.costEstimates];
    newEstimates[activityIndex][category][itemIndex][field] = field === 'cost' ? Number(value) : value;
    return {
      ...prev,
      costEstimates: newEstimates
    };
  });
};

const addCostItem = (activityIndex, category) => {
  setCostEstimateForm(prev => {
    const newEstimates = [...prev.costEstimates];
    newEstimates[activityIndex][category].push({ name: "", cost: 0 });
    return {
      ...prev,
      costEstimates: newEstimates
    };
  });
};

// Remove a cost item from a category
const removeCostItem = (activityIndex, category, itemIndex) => {
  setCostEstimateForm(prev => {
    const newEstimates = [...prev.costEstimates];
    newEstimates[activityIndex][category].splice(itemIndex, 1);
    return {
      ...prev,
      costEstimates: newEstimates
    };
  });
};

// Add a new activity
const addActivity = () => {
  setCostEstimateForm(prev => ({
    ...prev,
    costEstimates: [
      ...prev.costEstimates,
      {
        activity: "",
        labor: [{ name: "", cost: 0 }],
        materials: [{ name: "", cost: 0 }],
        equipment: [{ name: "", cost: 0 }],
        facilities: [{ name: "", cost: 0 }],
        subcontractor: [{ name: "", cost: 0 }],
        travel: [{ name: "", cost: 0 }],
        reserve: [{ name: "", cost: 0 }],
        costOfActivity: 0
      }
    ]
  }));
};

// Remove an activity
const removeActivity = (activityIndex) => {
  setCostEstimateForm(prev => {
    const newEstimates = [...prev.costEstimates];
    newEstimates.splice(activityIndex, 1);
    return {
      ...prev,
      costEstimates: newEstimates
    };
  });
};

// Calculate total cost for a specific activity
const calculateActivityCost = (activity) => {
  return [
    ...activity.labor,
    ...activity.materials,
    ...activity.equipment,
    ...activity.facilities,
    ...activity.subcontractor,
    ...activity.travel,
    ...activity.reserve
  ].reduce((total, item) => total + Number(item.cost), 0);
};

const openDetermineBudgetModal = (projectId) => {
  setSelectedProjectId(projectId);
  setDetermineBudgetModal(true);
};

const handleDetermineBudget = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/cost/determineBudget`,
      determineBudgetForm
    );
    setDetermineBudgetModal(false);
    alert("Budget determined successfully!");
  } catch (error) {
    console.error("Failed to determine budget:", error);
    console.error("Error details:", error.response?.data);
    alert("Failed to determine budget. Please try again.");
  }
};

// Handle changes to cost baseline
const handleCostBaselineChange = (value) => {
  setDetermineBudgetForm(prev => ({
    ...prev,
    costBaseline: Number(value)
  }));
};

// Handle changes to funding requirements
const handleFundingRequirementChange = (index, field, value) => {
  setDetermineBudgetForm(prev => {
    const newRequirements = [...prev.projectFundingRequirements];
    newRequirements[index] = {
      ...newRequirements[index],
      [field]: field === 'cost' ? Number(value) : value
    };
    return {
      ...prev,
      projectFundingRequirements: newRequirements
    };
  });
};

const addFundingRequirement = () => {
  setDetermineBudgetForm(prev => ({
    ...prev,
    projectFundingRequirements: [
      ...prev.projectFundingRequirements,
      { period: "", cost: 0 }
    ]
  }));
};

// Remove a funding requirement
const removeFundingRequirement = (index) => {
  setDetermineBudgetForm(prev => {
    const newRequirements = [...prev.projectFundingRequirements];
    newRequirements.splice(index, 1);
    return {
      ...prev,
      projectFundingRequirements: newRequirements
    };
  });
};

const openResourceManagementModal = (projectId) => {
  setSelectedProjectId(projectId);
  setResourceManagementModal(true);
};



const handlePlanResourceManagement = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/resource/planResourceManagement`,
      resourceManagementForm
    );
    setResourceManagementModal(false);
    alert("Resource management plan updated successfully!");
  } catch (error) {
    console.error("Failed to update resource management plan:", error);
    alert("Failed to update resource management plan. Please try again.");
  }
};

const handleResourceManagementFormChange = (field, value) => {
  setResourceManagementForm(prev => ({
    ...prev,
    resourceManagementPlan: {
      ...prev.resourceManagementPlan,
      [field]: value
    }
  }));
};

const openEstimateResourceModal = (projectId) => {
  setSelectedProjectId(projectId);
  setEstimateResourceModal(true);
};

const handleEstimateActivityResource = async () => {
  try {
    await axios.patch(
      `/projects/${selectedProjectId}/planning/resource/estimateActivityResource`,
      estimateResourceForm
    );
    setEstimateResourceModal(false);
    alert("Resource requirements updated successfully!");
  } catch (error) {
    console.error("Failed to update resource requirements:", error);
    alert("Failed to update resource requirements. Please try again.");
  }
};

// Handle changes to resource requirements
const handleResourceRequirementChange = (index, field, value) => {
  setEstimateResourceForm(prev => {
    const newRequirements = [...prev.resourceRequireMents];
    newRequirements[index] = {
      ...newRequirements[index],
      [field]: field === 'expectedUse' ? Number(value) : value
    };
    return {
      ...prev,
      resourceRequireMents: newRequirements
    };
  });
};

// Handle basis of estimates change
const handleBasisOfEstimatesChange = (value) => {
  setEstimateResourceForm(prev => ({
    ...prev,
    basisOfEstimates: value
  }));
};

const addResourceRequirement = () => {
  setEstimateResourceForm(prev => ({
    ...prev,
    resourceRequireMents: [
      ...prev.resourceRequireMents,
      { timePeriod: "", resource: "", expectedUse: 0, units: "" }
    ]
  }));
};

// Remove a resource requirement
const removeResourceRequirement = (index) => {
  setEstimateResourceForm(prev => {
    const newRequirements = [...prev.resourceRequireMents];
    newRequirements.splice(index, 1);
    return {
      ...prev,
      resourceRequireMents: newRequirements
    };
  });
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

                {/* Planning Phase */}
                <div className={css.phaseItem}>
                  <div 
                    className={css.phaseNode}
                    onClick={() => togglePhase(project._id, 'planning')}
                  >
                    {expandedPhases[`${project._id}-planning`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Folder size={16} className={css.icon} />
                    <span>Planning Phase</span>
                  </div>
                  
                  {/* Planning Phase Actions */}
                  {expandedPhases[`${project._id}-planning`] && (
                    <div className={css.actionContainer}>
                      <div 
                        className={css.actionItem}
                        onClick={() => openScopeManagementModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Plan Scope Management</span>
                      </div>
                      <div 
                        className={css.actionItem}
                        onClick={() => openCollectRequirementsModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Collect Requirements</span>
                      </div>
                      <div 
                        className={css.actionItem}
                        onClick={() => openDefineScopeModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Define Scope</span>
                      </div>
                      <div 
                        className={css.actionItem}
                        onClick={() => openCreateWBSModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Create WBS</span>
                      </div>
                      <div 
                        className={css.actionItem}
                        onClick={() => openScheduleManagementModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Plan Schedule Management</span>
                      </div>
                      <div 
                        className={css.actionItem}
                        onClick={() => openCostManagementModal(project._id)}
                      >
                        <File size={14} className={css.icon} />
                        <span>Plan Cost Management</span>
                      </div>
                      <div 
                      className={css.actionItem}
                      onClick={() => openCostEstimateModal(project._id)}
                    >
                      <File size={14} className={css.icon} />
                      <span>Estimate Cost</span>
                    </div>
                     <div 
                    className={css.actionItem}
                    onClick={() => openDetermineBudgetModal(project._id)}
                  >
                    <File size={14} className={css.icon} />
                    <span>Determine Budget</span>
                  </div>
                  <div 
                  className={css.actionItem}
                  onClick={() => openResourceManagementModal(project._id)}
                >
                  <File size={14} className={css.icon} />
                  <span>Plan Resource Management</span>
                </div>
                <div 
                  className={css.actionItem}
                  onClick={() => openEstimateResourceModal(project._id)}
                >
                  <File size={14} className={css.icon} />
                  <span>Estimate Activity Resources</span>
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
      {/* Plan Scope Management Modal */}
      <Modal 
        isOpen={scopeManagementModal} 
        onClose={() => setScopeManagementModal(false)} 
        title="Plan Scope Management"
      >
        <form onSubmit={(e) => { e.preventDefault(); handlePlanScopeManagement(); }}>
          <h4>Scope Management Plan</h4>
          
          <div className={css.formGroup}>
            <label>Project Scope Statement</label>
            <textarea 
              value={scopeManagementForm.scopeManagementPlan.projectScopeStatement} 
              onChange={(e) => handleScopeManagementFormChange('scopeManagementPlan', 'projectScopeStatement', e.target.value)} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Work Breakdown Structure (WBS)</label>
            <textarea 
              value={scopeManagementForm.scopeManagementPlan.WBS} 
              onChange={(e) => handleScopeManagementFormChange('scopeManagementPlan', 'WBS', e.target.value)} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Scope Baseline</label>
            <textarea 
              value={scopeManagementForm.scopeManagementPlan.scopeBaseline} 
              onChange={(e) => handleScopeManagementFormChange('scopeManagementPlan', 'scopeBaseline', e.target.value)} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Project Deliverables</label>
            <textarea 
              value={scopeManagementForm.scopeManagementPlan.projectDeliverables} 
              onChange={(e) => handleScopeManagementFormChange('scopeManagementPlan', 'projectDeliverables', e.target.value)} 
              required
            />
          </div>
          
          <h4>Requirements Management Plan</h4>
          
          <div className={css.formGroup}>
            <label>Requirement Activities</label>
            <textarea 
              value={scopeManagementForm.requirementsManagementPlan.requirementActivities} 
              onChange={(e) => handleScopeManagementFormChange('requirementsManagementPlan', 'requirementActivities', e.target.value)} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Changes Managed & Approved</label>
            <textarea 
              value={scopeManagementForm.requirementsManagementPlan.changesManagedApproved} 
              onChange={(e) => handleScopeManagementFormChange('requirementsManagementPlan', 'changesManagedApproved', e.target.value)} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Requirement Prioritized</label>
            <textarea 
              value={scopeManagementForm.requirementsManagementPlan.requirementPrioritised} 
              onChange={(e) => handleScopeManagementFormChange('requirementsManagementPlan', 'requirementPrioritised', e.target.value)} 
              required
            />
          </div>
          
          <div className={css.formGroup}>
            <label>Metrics Used</label>
            <textarea 
              value={scopeManagementForm.requirementsManagementPlan.metricsUsed} 
              onChange={(e) => handleScopeManagementFormChange('requirementsManagementPlan', 'metricsUsed', e.target.value)} 
              required
            />
          </div>
          
          <div className={css.modalActions}>
            <button type="button" onClick={() => setScopeManagementModal(false)}>Cancel</button>
            <button type="submit" className={css.primaryButton}>Update Scope Management</button>
          </div>
        </form>
      </Modal>
      {/* Collect Requirements Modal */}
        <Modal 
          isOpen={collectRequirementsModal} 
          onClose={() => setCollectRequirementsModal(false)} 
          title="Collect Requirements"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleCollectRequirements(); }}>
            <h4>Project Requirements</h4>
            
            {collectRequirementsForm.requirements.map((req, index) => (
              <div key={`requirement-${index}`} className={css.requirementItem}>
                <div className={css.formGroup}>
                  <label>Requirement {index + 1}</label>
                  <textarea 
                    value={req.requirement} 
                    onChange={(e) => handleRequirementChange(index, 'requirement', e.target.value)} 
                    placeholder="Enter requirement details"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>Documentation</label>
                  <textarea 
                    value={req.documentation} 
                    onChange={(e) => handleRequirementChange(index, 'documentation', e.target.value)} 
                    placeholder="Enter supporting documentation"
                    required
                  />
                </div>
                
                {collectRequirementsForm.requirements.length > 1 && (
                  <button 
                    type="button" 
                    className={css.removeButton}
                    onClick={() => removeRequirement(index)}
                  >
                    Remove Requirement
                  </button>
                )}
                
                <hr className={index < collectRequirementsForm.requirements.length - 1 ? css.requirementDivider : css.hidden} />
              </div>
            ))}
            
            <button 
              type="button" 
              className={css.addButton}
              onClick={addRequirement}
            >
              Add Requirement
            </button>
            
            <div className={css.modalActions}>
              <button type="button" onClick={() => setCollectRequirementsModal(false)}>Cancel</button>
              <button type="submit" className={css.primaryButton}>Submit Requirements</button>
            </div>
          </form>
        </Modal>
        {/* Define Scope Modal */}
          <Modal 
  isOpen={defineScopeModal} 
  onClose={() => setDefineScopeModal(false)} 
  title="Define Scope"
>
  <form onSubmit={(e) => { e.preventDefault(); handleDefineScope(); }}>
    <div className={css.formGroup}>
      <label>End Product Scope Description</label>
      <textarea 
        name="endProductScopeDescription" 
        value={defineScopeForm.endProductScopeDescription} 
        onChange={handleDefineScopeTextChange} 
        placeholder="Describe the end product scope"
        required
      />
    </div>
    
    {/* Deliverables Section - Updated to use API */}
    <div className={css.formGroup}>
      <h4>Deliverables</h4>
      
      {/* Create new deliverable form */}
      <div className={css.newDeliverableForm}>
        <h5>Create New Deliverable</h5>
        <div className={css.formGroup}>
          <label>Name</label>
          <input 
            type="text" 
            value={newDeliverable.name} 
            onChange={(e) => handleNewDeliverableChange('name', e.target.value)}
            placeholder="Enter deliverable name"
          />
        </div>
        <div className={css.formGroup}>
          <label>Description</label>
          <textarea 
            value={newDeliverable.description} 
            onChange={(e) => handleNewDeliverableChange('description', e.target.value)}
            placeholder="Enter deliverable description"
          />
        </div>
        <button 
          type="button" 
          onClick={createDeliverable}
          className={css.addButton}
        >
          Create Deliverable
        </button>
      </div>
      
      {/* Select from existing deliverables */}
      <div className={css.deliverablesListContainer}>
        <h5>Select Deliverables for Scope</h5>
        {availableDeliverables.length === 0 ? (
          <p>No deliverables available. Create some using the form above.</p>
        ) : (
          <div className={css.deliverablesList}>
            {availableDeliverables.map(deliverable => (
              <div key={deliverable._id} className={css.deliverableItem}>
                <label className={css.checkboxItem}>
                  <input 
                    type="checkbox" 
                    checked={defineScopeForm.deliverables.includes(deliverable._id)} 
                    onChange={() => toggleDeliverable(deliverable._id)} 
                  />
                  <span>{deliverable.name}</span>
                </label>
                <div>
                  <button 
                    type="button" 
                    onClick={() => deleteDeliverable(deliverable._id)}
                    className={css.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    
    {/* Keep acceptance criteria as is */}
    <div className={css.formGroup}>
      <h4>Acceptance Criteria</h4>
      {defineScopeForm.acceptanceCriteria.map((item, index) => (
        <div key={`criteria-${index}`} className={css.arrayInput}>
          <input 
            type="text" 
            value={item} 
            onChange={(e) => handleDefineScopeArrayChange('acceptanceCriteria', index, e.target.value)} 
            placeholder="Enter acceptance criteria"
            required
          />
          {defineScopeForm.acceptanceCriteria.length > 1 && (
            <button 
              type="button" 
              onClick={() => removeDefineScopeItem('acceptanceCriteria', index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button 
        type="button" 
        className={css.addButton}
        onClick={() => addDefineScopeItem('acceptanceCriteria')}
      >
        Add Acceptance Criteria
      </button>
    </div>
    
    {/* Exclusions section */}
<div className={css.formGroup}>
  <h4>Exclusions</h4>
  {defineScopeForm.exclusions.map((item, index) => (
    <div key={`exclusion-${index}`} className={css.arrayInput}>
      <input 
        type="text" 
        value={item} 
        onChange={(e) => handleDefineScopeArrayChange('exclusions', index, e.target.value)} 
        placeholder="Enter exclusion"
        required
        className={css.inputField}
      />
      {defineScopeForm.exclusions.length > 1 && (
        <button 
          type="button" 
          onClick={() => removeDefineScopeItem('exclusions', index)}
        >
          Remove
        </button>
      )}
    </div>
  ))}
  <button 
    type="button" 
    className={css.addButton}
    onClick={() => addDefineScopeItem('exclusions')}
  >
    Add Exclusion
  </button>
</div>
    
    <div className={css.modalActions}>
      <button type="button" onClick={() => setDefineScopeModal(false)}>Cancel</button>
      <button type="submit" className={css.primaryButton}>Submit Scope Definition</button>
    </div>
  </form>
</Modal>
          <Modal 
  isOpen={createWBSModal} 
  onClose={() => setCreateWBSModal(false)} 
  title="Create Work Breakdown Structure"
>
  <form onSubmit={(e) => { e.preventDefault(); handleCreateWBS(); }}>
    {/* Create new work item section */}
    <div className={css.formGroup}>
      <h4>Create New Work Item</h4>
      <div className={css.formGroup}>
        <label>Name</label>
        <input 
          type="text" 
          value={newWorkItem.name} 
          onChange={(e) => handleNewWorkItemChange('name', e.target.value)}
          placeholder="Enter work item name"
          className={css.inputField}
        />
      </div>
      <div className={css.formGroup}>
        <label>Description</label>
        <textarea 
          value={newWorkItem.description} 
          onChange={(e) => handleNewWorkItemChange('description', e.target.value)}
          placeholder="Enter work item description"
          className={css.textareaField}
        />
      </div>
      
      {/* Deliverable selection */}
      <div className={css.formGroup}>
        <label>Associated Deliverable (Optional)</label>
        <select 
          value={newWorkItem.deliverable} 
          onChange={(e) => handleNewWorkItemChange('deliverable', e.target.value)}
          className={css.selectField}
        >
          <option value="">Select a deliverable</option>
          {availableDeliverables.map(deliverable => (
            <option key={deliverable._id} value={deliverable._id}>
              {deliverable.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Parent work items selection */}
      <div className={css.formGroup}>
        <label>Parent Work Items (Optional)</label>
        {availableWorkItems.length > 0 ? (
          <div className={css.workItemsList}>
            {availableWorkItems.map(work => (
              <div key={work._id} className={css.checkboxItem}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={newWorkItem.work.includes(work._id)} 
                    onChange={() => toggleParentWork(work._id)} 
                  />
                  <span>{work.name}</span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p>No existing work items available</p>
        )}
      </div>
      
      <button 
        type="button" 
        onClick={createWorkItem}
        className={css.addButton}
      >
        Create Work Item
      </button>
    </div>
    
    {/* Work items selection for WBS */}
    <div className={css.formGroup}>
      <h4>Select Work Items for WBS</h4>
      {availableWorkItems.length === 0 ? (
        <p>No work items available. Create some using the form above.</p>
      ) : (
        <div className={css.workItemsList}>
          {availableWorkItems.map(work => (
            <div key={work._id} className={css.workItem}>
              <div className={css.workItemHeader}>
                <label className={css.checkboxItem}>
                  <input 
                    type="checkbox" 
                    checked={wbsForm.WBS.includes(work._id)} 
                    onChange={() => toggleWbsSelection(work._id)} 
                  />
                  <span className={css.workItemName}>{work.name}</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => deleteWorkItem(work._id)}
                  className={css.deleteButton}
                >
                  Delete
                </button>
              </div>
              {work.description && (
                <div className={css.workItemDescription}>
                  <small>{work.description}</small>
                </div>
              )}
              {work.deliverable && (
                <div className={css.workItemDeliverable}>
                  <small>Deliverable: {availableDeliverables.find(d => d._id === work.deliverable)?.name || "Unknown"}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    
    <div className={css.modalActions}>
      <button type="button" onClick={() => setCreateWBSModal(false)}>Cancel</button>
      <button type="submit" className={css.primaryButton}>Submit WBS</button>
    </div>
  </form>
</Modal>
          {/* Plan Schedule Management Modal */}
            <Modal 
              isOpen={scheduleManagementModal} 
              onClose={() => setScheduleManagementModal(false)} 
              title="Plan Schedule Management"
            >
              <form onSubmit={(e) => { e.preventDefault(); handlePlanScheduleManagement(); }}>
                <h4>Schedule Management Plan</h4>
                
                <div className={css.formGroup}>
                  <label>Change of Schedule</label>
                  <textarea 
                    value={scheduleManagementForm.scheduleManagementPlan.changeOfSchedule} 
                    onChange={(e) => handleScheduleManagementFormChange('changeOfSchedule', e.target.value)} 
                    placeholder="Describe how changes to the schedule will be managed"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>Level of Detail</label>
                  <textarea 
                    value={scheduleManagementForm.scheduleManagementPlan.levelOfDetail} 
                    onChange={(e) => handleScheduleManagementFormChange('levelOfDetail', e.target.value)} 
                    placeholder="Define the level of detail for schedule activities"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>Dependencies</label>
                  <textarea 
                    value={scheduleManagementForm.scheduleManagementPlan.dependencies} 
                    onChange={(e) => handleScheduleManagementFormChange('dependencies', e.target.value)} 
                    placeholder="Describe schedule dependencies"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>Units of Measure</label>
                  <textarea 
                    value={scheduleManagementForm.scheduleManagementPlan.unitsOfMeasure} 
                    onChange={(e) => handleScheduleManagementFormChange('unitsOfMeasure', e.target.value)} 
                    placeholder="Define units of measure for time estimation"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>Requests for Changes</label>
                  <textarea 
                    value={scheduleManagementForm.scheduleManagementPlan.requestsForChanges} 
                    onChange={(e) => handleScheduleManagementFormChange('requestsForChanges', e.target.value)} 
                    placeholder="Describe process for handling schedule change requests"
                    required
                  />
                </div>
                
                <div className={css.modalActions}>
                  <button type="button" onClick={() => setScheduleManagementModal(false)}>Cancel</button>
                  <button type="submit" className={css.primaryButton}>Update Schedule Management</button>
                </div>
              </form>
            </Modal>
            {/* Plan Cost Management Modal */}
            <Modal 
              isOpen={costManagementModal} 
              onClose={() => setCostManagementModal(false)} 
              title="Plan Cost Management"
            >
              <form onSubmit={(e) => { e.preventDefault(); handlePlanCostManagement(); }}>
                <h4>Cost Management Plan</h4>
                
                <div className={css.formGroup}>
                  <h4>Units</h4>
                  {costManagementForm.costManagementPlan.units.map((item, index) => (
                    <div key={`unit-${index}`} className={css.arrayInput}>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleCostManagementArrayChange('units', index, e.target.value)} 
                        placeholder="Enter unit of measure"
                        required
                      />
                      {costManagementForm.costManagementPlan.units.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeCostManagementItem('units', index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={css.addButton}
                    onClick={() => addCostManagementItem('units')}
                  >
                    Add Unit
                  </button>
                </div>
                
                <div className={css.formGroup}>
                  <h4>Precision</h4>
                  {costManagementForm.costManagementPlan.precision.map((item, index) => (
                    <div key={`precision-${index}`} className={css.arrayInput}>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleCostManagementArrayChange('precision', index, e.target.value)} 
                        placeholder="Enter precision level"
                        required
                      />
                      {costManagementForm.costManagementPlan.precision.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeCostManagementItem('precision', index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={css.addButton}
                    onClick={() => addCostManagementItem('precision')}
                  >
                    Add Precision
                  </button>
                </div>
                
                <div className={css.formGroup}>
                  <h4>Ranges</h4>
                  {costManagementForm.costManagementPlan.ranges.map((item, index) => (
                    <div key={`range-${index}`} className={css.arrayInput}>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleCostManagementArrayChange('ranges', index, e.target.value)} 
                        placeholder="Enter acceptable cost range"
                        required
                      />
                      {costManagementForm.costManagementPlan.ranges.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeCostManagementItem('ranges', index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={css.addButton}
                    onClick={() => addCostManagementItem('ranges')}
                  >
                    Add Range
                  </button>
                </div>
                
                <div className={css.formGroup}>
                  <h4>Rules</h4>
                  {costManagementForm.costManagementPlan.rules.map((item, index) => (
                    <div key={`rule-${index}`} className={css.arrayInput}>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleCostManagementArrayChange('rules', index, e.target.value)} 
                        placeholder="Enter cost management rule"
                        required
                      />
                      {costManagementForm.costManagementPlan.rules.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeCostManagementItem('rules', index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={css.addButton}
                    onClick={() => addCostManagementItem('rules')}
                  >
                    Add Rule
                  </button>
                </div>
                
                <div className={css.formGroup}>
                  <h4>Reporting Formats & Frequency</h4>
                  {costManagementForm.costManagementPlan.reportingFormatsFrequency.map((item, index) => (
                    <div key={`reporting-${index}`} className={css.arrayInput}>
                      <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleCostManagementArrayChange('reportingFormatsFrequency', index, e.target.value)} 
                        placeholder="Enter reporting format/frequency"
                        required
                      />
                      {costManagementForm.costManagementPlan.reportingFormatsFrequency.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeCostManagementItem('reportingFormatsFrequency', index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className={css.addButton}
                    onClick={() => addCostManagementItem('reportingFormatsFrequency')}
                  >
                    Add Reporting Format/Frequency
                  </button>
                </div>
                
                <div className={css.modalActions}>
                  <button type="button" onClick={() => setCostManagementModal(false)}>Cancel</button>
                  <button type="submit" className={css.primaryButton}>Update Cost Management</button>
                </div>
              </form>
            </Modal>
            {/* Estimate Cost Modal */}
           <Modal 
  isOpen={costEstimateModal} 
  onClose={() => setCostEstimateModal(false)} 
  title="Estimate Activity Cost"
>
  <form onSubmit={(e) => { e.preventDefault(); handleEstimateCost(); }}>
    {/* Activity Creation Section */}
    <div className={css.formGroup}>
      <h4>Create New Activity</h4>
      <div className={css.formGroup}>
        <label>Activity Name</label>
        <input 
          type="text" 
          value={newActivity.name} 
          onChange={(e) => handleNewActivityChange('name', e.target.value)}
          placeholder="Enter activity name"
          className={css.inputField}
        />
      </div>
      
      <div className={css.formGroup}>
        <label>Work Package</label>
        <select
          value={newActivity.workPackage}
          onChange={(e) => handleNewActivityChange('workPackage', e.target.value)}
          className={css.selectField}
          required
        >
          <option value="">Select a work package</option>
          {Array.isArray(availableWorkItems) && availableWorkItems.map(work => (
            <option key={work._id} value={work._id}>
              {work.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className={css.formGroup}>
        <label>Initial Scope Description</label>
        <textarea 
          value={newActivity.initialScopeDescription} 
          onChange={(e) => handleNewActivityChange('initialScopeDescription', e.target.value)}
          placeholder="Enter initial scope description"
          className={css.textareaField}
        />
      </div>
      
      <div className={css.formGroup}>
        <label>Detailed Scope Description</label>
        <textarea 
          value={newActivity.detailedScopeDescription} 
          onChange={(e) => handleNewActivityChange('detailedScopeDescription', e.target.value)}
          placeholder="Enter detailed scope description"
          className={css.textareaField}
        />
      </div>
      
      <div className={css.formGroup}>
        <label>Duration (days)</label>
        <input 
          type="number" 
          value={newActivity.duration} 
          onChange={(e) => handleNewActivityChange('duration', e.target.value)}
          placeholder="Enter duration"
          className={css.inputField}
        />
      </div>
      
      <button 
        type="button" 
        onClick={createActivity}
        className={css.addButton}
        disabled={!newActivity.name || !newActivity.workPackage}
      >
        Create Activity
      </button>
    </div>
    
    <hr className={css.sectionDivider} />

    {/* Cost Estimation Section */}
    <div className={css.costEstimateContainer}>
      {costEstimateForm.costEstimates.map((estimate, estimateIndex) => (
        <div key={`estimate-${estimateIndex}`} className={css.activityEstimate}>
          <h4>Cost Estimate {estimateIndex + 1}</h4>
          
          <div className={css.formGroup}>
            <label>Select Activity</label>
            <select
              value={estimate.activityId}
              onChange={(e) => handleActivitySelection(estimateIndex, e.target.value)}
              className={css.selectField}
            >
              <option value="">Select an activity</option>
              {Array.isArray(availableActivities) && availableActivities.map(activity => (
                <option key={activity._id} value={activity._id}>
                  {activity.name}
                </option>
              ))}
            </select>
            
            {estimate.activityId && (
              <div className={css.selectedActivityDetails}>
                <small>
                  <strong>Selected Activity:</strong> {Array.isArray(availableActivities) && availableActivities.find(a => a._id === estimate.activityId)?.name}
                </small>
                <button 
                  type="button" 
                  onClick={() => deleteActivity(estimate.activityId)}
                  className={css.deleteButton}
                >
                  Delete Activity
                </button>
              </div>
            )}
          </div>
          
          {/* Only show cost categories if an activity is selected */}
          {estimate.activityId && (
            <>
              {/* Labor Costs */}
              <div className={css.costCategory}>
                <h5>Labor</h5>
                {estimate.labor.map((item, itemIndex) => (
                  <div key={`labor-${itemIndex}`} className={css.costItemRow}>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'labor', itemIndex, 'name', e.target.value)}
                      placeholder="Labor description"
                      required
                      className={css.costItemName}
                    />
                    <input 
                      type="number" 
                      value={item.cost} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'labor', itemIndex, 'cost', e.target.value)}
                      placeholder="Cost"
                      required
                      className={css.costItemValue}
                    />
                    {estimate.labor.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCostItem(estimateIndex, 'labor', itemIndex)}
                        className={css.removeCostItemBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addCostItem(estimateIndex, 'labor')}
                  className={css.addButton}
                >
                  Add Labor Cost
                </button>
              </div>
              
              {/* Materials Costs */}
              <div className={css.costCategory}>
                <h5>Materials</h5>
                {estimate.materials.map((item, itemIndex) => (
                  <div key={`materials-${itemIndex}`} className={css.costItemRow}>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'materials', itemIndex, 'name', e.target.value)}
                      placeholder="Material description"
                      required
                      className={css.costItemName}
                    />
                    <input 
                      type="number" 
                      value={item.cost} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'materials', itemIndex, 'cost', e.target.value)}
                      placeholder="Cost"
                      required
                      className={css.costItemValue}
                    />
                    {estimate.materials.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCostItem(estimateIndex, 'materials', itemIndex)}
                        className={css.removeCostItemBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addCostItem(estimateIndex, 'materials')}
                  className={css.addButton}
                >
                  Add Material Cost
                </button>
              </div>
              
              {/* Equipment Costs */}
              <div className={css.costCategory}>
                <h5>Equipment</h5>
                {estimate.equipment.map((item, itemIndex) => (
                  <div key={`equipment-${itemIndex}`} className={css.costItemRow}>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'equipment', itemIndex, 'name', e.target.value)}
                      placeholder="Equipment description"
                      required
                      className={css.costItemName}
                    />
                    <input 
                      type="number" 
                      value={item.cost} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'equipment', itemIndex, 'cost', e.target.value)}
                      placeholder="Cost"
                      required
                      className={css.costItemValue}
                    />
                    {estimate.equipment.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCostItem(estimateIndex, 'equipment', itemIndex)}
                        className={css.removeCostItemBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addCostItem(estimateIndex, 'equipment')}
                  className={css.addButton}
                >
                  Add Equipment Cost
                </button>
              </div>
              
              {/* Facilities Costs */}
              <div className={css.costCategory}>
                <h5>Facilities</h5>
                {estimate.facilities.map((item, itemIndex) => (
                  <div key={`facilities-${itemIndex}`} className={css.costItemRow}>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'facilities', itemIndex, 'name', e.target.value)}
                      placeholder="Facilities description"
                      required
                      className={css.costItemName}
                    />
                    <input 
                      type="number" 
                      value={item.cost} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'facilities', itemIndex, 'cost', e.target.value)}
                      placeholder="Cost"
                      required
                      className={css.costItemValue}
                    />
                    {estimate.facilities.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCostItem(estimateIndex, 'facilities', itemIndex)}
                        className={css.removeCostItemBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addCostItem(estimateIndex, 'facilities')}
                  className={css.addButton}
                >
                  Add Facilities Cost
                </button>
              </div>

              {/* Subcontractor Costs */}
              <div className={css.costCategory}>
                <h5>Subcontractor</h5>
                {estimate.subcontractor.map((item, itemIndex) => (
                  <div key={`subcontractor-${itemIndex}`} className={css.costItemRow}>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'subcontractor', itemIndex, 'name', e.target.value)}
                      placeholder="Subcontractor description"
                      required
                      className={css.costItemName}
                    />
                    <input 
                      type="number" 
                      value={item.cost} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'subcontractor', itemIndex, 'cost', e.target.value)}
                      placeholder="Cost"
                      required
                      className={css.costItemValue}
                    />
                    {estimate.subcontractor.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCostItem(estimateIndex, 'subcontractor', itemIndex)}
                        className={css.removeCostItemBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addCostItem(estimateIndex, 'subcontractor')}
                  className={css.addButton}
                >
                  Add Subcontractor Cost
                </button>
              </div>

              {/* Travel Costs */}
              <div className={css.costCategory}>
                <h5>Travel</h5>
                {estimate.travel.map((item, itemIndex) => (
                  <div key={`travel-${itemIndex}`} className={css.costItemRow}>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'travel', itemIndex, 'name', e.target.value)}
                      placeholder="Travel description"
                      required
                      className={css.costItemName}
                    />
                    <input 
                      type="number" 
                      value={item.cost} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'travel', itemIndex, 'cost', e.target.value)}
                      placeholder="Cost"
                      required
                      className={css.costItemValue}
                    />
                    {estimate.travel.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCostItem(estimateIndex, 'travel', itemIndex)}
                        className={css.removeCostItemBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addCostItem(estimateIndex, 'travel')}
                  className={css.addButton}
                >
                  Add Travel Cost
                </button>
              </div>

              {/* Reserve Costs */}
              <div className={css.costCategory}>
                <h5>Reserve</h5>
                {estimate.reserve.map((item, itemIndex) => (
                  <div key={`reserve-${itemIndex}`} className={css.costItemRow}>
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'reserve', itemIndex, 'name', e.target.value)}
                      placeholder="Reserve description"
                      required
                      className={css.costItemName}
                    />
                    <input 
                      type="number" 
                      value={item.cost} 
                      onChange={(e) => handleCostItemChange(estimateIndex, 'reserve', itemIndex, 'cost', e.target.value)}
                      placeholder="Cost"
                      required
                      className={css.costItemValue}
                    />
                    {estimate.reserve.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCostItem(estimateIndex, 'reserve', itemIndex)}
                        className={css.removeCostItemBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => addCostItem(estimateIndex, 'reserve')}
                  className={css.addButton}
                >
                  Add Reserve Cost
                </button>
              </div>
              
              <div className={css.totalCost}>
                <strong>Total Activity Cost:</strong> {calculateActivityCost(estimate)}
              </div>
            </>
          )}
          
          {costEstimateForm.costEstimates.length > 1 && (
            <button 
              type="button" 
              onClick={() => removeEstimate(estimateIndex)}
              className={css.removeEstimateBtn}
            >
              Remove Cost Estimate
            </button>
          )}
          
          <hr className={estimateIndex < costEstimateForm.costEstimates.length - 1 ? css.activityDivider : css.hidden} />
        </div>
      ))}
      
      <button 
        type="button" 
        onClick={() => setCostEstimateForm(prev => ({
          ...prev,
          costEstimates: [
            ...prev.costEstimates,
            {
              activityId: "",
              labor: [{ name: "", cost: 0 }],
              materials: [{ name: "", cost: 0 }],
              equipment: [{ name: "", cost: 0 }],
              facilities: [{ name: "", cost: 0 }],
              subcontractor: [{ name: "", cost: 0 }],
              travel: [{ name: "", cost: 0 }],
              reserve: [{ name: "", cost: 0 }],
              costOfActivity: 0
            }
          ]
        }))}
        className={css.addButton}
      >
        Add Cost Estimate
      </button>
      
      <div className={css.modalActions}>
        <button type="button" onClick={() => setCostEstimateModal(false)}>Cancel</button>
        <button type="submit" className={css.primaryButton}>Update Cost Estimates</button>
      </div>
    </div>
  </form>
</Modal>
            {/* Plan Resource Management Modal */}
            <Modal 
              isOpen={resourceManagementModal} 
              onClose={() => setResourceManagementModal(false)} 
              title="Plan Resource Management"
            >
              <form onSubmit={(e) => { e.preventDefault(); handlePlanResourceManagement(); }}>
                <h4>Resource Management Plan</h4>
                
                <div className={css.formGroup}>
                  <label>How Resources Are Identified</label>
                  <textarea 
                    value={resourceManagementForm.resourceManagementPlan.identified} 
                    onChange={(e) => handleResourceManagementFormChange('identified', e.target.value)} 
                    placeholder="Describe how resources are identified"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>How Resources Are Obtained</label>
                  <textarea 
                    value={resourceManagementForm.resourceManagementPlan.obtained} 
                    onChange={(e) => handleResourceManagementFormChange('obtained', e.target.value)} 
                    placeholder="Describe how resources are obtained"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>Roles and Responsibilities</label>
                  <textarea 
                    value={resourceManagementForm.resourceManagementPlan.roles} 
                    onChange={(e) => handleResourceManagementFormChange('roles', e.target.value)} 
                    placeholder="Define roles and responsibilities"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>Training Requirements</label>
                  <textarea 
                    value={resourceManagementForm.resourceManagementPlan.training} 
                    onChange={(e) => handleResourceManagementFormChange('training', e.target.value)} 
                    placeholder="Describe training requirements"
                    required
                  />
                </div>
                
                <div className={css.formGroup}>
                  <label>How Resource Quality Is Ensured</label>
                  <textarea 
                    value={resourceManagementForm.resourceManagementPlan.ensured} 
                    onChange={(e) => handleResourceManagementFormChange('ensured', e.target.value)} 
                    placeholder="Describe how resource quality is ensured"
                    required
                  />
                </div>
                
                <div className={css.modalActions}>
                  <button type="button" onClick={() => setResourceManagementModal(false)}>Cancel</button>
                  <button type="submit" className={css.primaryButton}>Update Resource Management</button>
                </div>
              </form>
            </Modal>
            {/* Estimate Activity Resources Modal */}
            <Modal 
              isOpen={estimateResourceModal} 
              onClose={() => setEstimateResourceModal(false)} 
              title="Estimate Activity Resources"
            >
              <form onSubmit={(e) => { e.preventDefault(); handleEstimateActivityResource(); }}>
                <div className={css.formGroup}>
                  <h4>Resource Requirements</h4>
                  {estimateResourceForm.resourceRequireMents.map((item, index) => (
                    <div key={`resource-req-${index}`} className={css.resourceRequirement}>
                      <div className={css.resourceRequirementFields}>
                        <div className={css.formGroup}>
                          <label>Time Period</label>
                          <input 
                            type="text" 
                            value={item.timePeriod} 
                            onChange={(e) => handleResourceRequirementChange(index, 'timePeriod', e.target.value)}
                            placeholder="Enter time period (e.g., Q1 2023)"
                            required
                            className={css.inputField}
                          />
                        </div>
                        <div className={css.formGroup}>
                          <label>Resource</label>
                          <input 
                            type="text" 
                            value={item.resource} 
                            onChange={(e) => handleResourceRequirementChange(index, 'resource', e.target.value)}
                            placeholder="Enter resource name"
                            required
                            className={css.inputField}
                          />
                        </div>
                        <div className={css.formGroup}>
                          <label>Expected Use</label>
                          <input 
                            type="number" 
                            value={item.expectedUse} 
                            onChange={(e) => handleResourceRequirementChange(index, 'expectedUse', e.target.value)}
                            placeholder="Enter expected use quantity"
                            required
                            className={css.inputField}
                          />
                        </div>
                        <div className={css.formGroup}>
                          <label>Units</label>
                          <input 
                            type="text" 
                            value={item.units} 
                            onChange={(e) => handleResourceRequirementChange(index, 'units', e.target.value)}
                            placeholder="Enter units (e.g., hours, days)"
                            required
                            className={css.inputField}
                          />
                        </div>
                      </div>
                      {estimateResourceForm.resourceRequireMents.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeResourceRequirement(index)}
                          className={css.removeBtn}
                        >
                          Remove
                        </button>
                      )}
                      <hr className={index < estimateResourceForm.resourceRequireMents.length - 1 ? css.requirementDivider : css.hidden} />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addResourceRequirement}
                    className={css.addButton}
                  >
                    Add Resource Requirement
                  </button>
                </div>
                
                <div className={css.formGroup}>
                  <label>Basis of Estimates</label>
                  <textarea 
                    value={estimateResourceForm.basisOfEstimates} 
                    onChange={(e) => handleBasisOfEstimatesChange(e.target.value)}
                    placeholder="Describe the basis for your resource estimates"
                    required
                    className={css.textareaField}
                  />
                </div>
                
                <div className={css.modalActions}>
                  <button type="button" onClick={() => setEstimateResourceModal(false)}>Cancel</button>
                  <button type="submit" className={css.primaryButton}>Submit Resource Estimates</button>
                </div>
              </form>
            </Modal>
    </div>
  );
}