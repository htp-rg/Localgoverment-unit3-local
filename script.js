let pipelineChart=null;

const STORAGE_KEYS={vendors:"vendor_engagements"};
const STORAGE_TASKS="dashboard_tasks";

function renderStars(num){ return "★".repeat(num)+"☆".repeat(5-num); }

function loadVendors(){
  const vendors=JSON.parse(localStorage.getItem(STORAGE_KEYS.vendors)||"[]");
  const tbody=document.querySelector("#vendorEngagementsTable tbody");
  tbody.innerHTML="";
  vendors.forEach((v,i)=>{
    const row=document.createElement("tr");
    row.innerHTML=`
      <td>${v.type}</td>
      <td>${v.status}</td>
      <td>${v.owner}</td>
      <td>${v.due}</td>
      <td>${v.payment}</td>
      <td><span class="star">${renderStars(v.rating||0)}</span></td>
      <td>
        <span class="edit-icon" onclick="editVendor(${i})">✏️</span>
        <span class="delete-icon" onclick="deleteVendor(${i})">🗑️</span>
      </td>`;
    tbody.appendChild(row);
  });
}

function saveVendors(vendors){ localStorage.setItem(STORAGE_KEYS.vendors,JSON.stringify(vendors)); }

function editVendor(i){
  const v=JSON.parse(localStorage.getItem(STORAGE_KEYS.vendors)||"[]")[i];
  document.getElementById("vendorModalTitle").textContent="Edit Vendor";
  vendorIndex.value=i;
  vendorType.value=v.type;
  vendorStatus.value=v.status;
  vendorOwner.value=v.owner;
  vendorDue.value=v.due;
  vendorPayment.value=v.payment;
  vendorRating.value=v.rating||0;
  vendorModal.classList.add("show");
}

function deleteVendor(i){
  const vendors=JSON.parse(localStorage.getItem(STORAGE_KEYS.vendors)||"[]");
  vendors.splice(i,1); saveVendors(vendors); loadVendors();
}

addVendorBtn.onclick=()=>{
  vendorModalTitle.textContent="Add Vendor";
  vendorIndex.value=""; document.querySelectorAll("#vendorModal input").forEach(i=>i.value="");
  vendorModal.classList.add("show");
};
saveVendorBtn.onclick=()=>{
  const vendors=JSON.parse(localStorage.getItem(STORAGE_KEYS.vendors)||"[]");
  const v={
    type:vendorType.value,
    status:vendorStatus.value,
    owner:vendorOwner.value,
    due:vendorDue.value,
    payment:vendorPayment.value,
    rating:parseInt(vendorRating.value)||0
  };
  const index=vendorIndex.value;
  if(index==="") vendors.push(v); else vendors[index]=v;
  saveVendors(vendors); loadVendors(); vendorModal.classList.remove("show");
};
closeVendorBtn.onclick=()=>vendorModal.classList.remove("show");

function loadTasks(){
  const tasks=JSON.parse(localStorage.getItem(STORAGE_TASKS)||"[]");
  const taskList=document.getElementById("taskList");
  taskList.innerHTML="";
  tasks.forEach((t,i)=>{
    const li=document.createElement("li");
    const checkbox=document.createElement("input");
    checkbox.type="checkbox"; checkbox.checked=t.completed||false;
    checkbox.onchange=()=>{ t.completed=checkbox.checked; localStorage.setItem(STORAGE_TASKS,JSON.stringify(tasks)); };
    const spanText=document.createElement("span"); spanText.textContent=" "+t.text;
    const iconContainer=document.createElement("div"); iconContainer.className="task-icons";
    const editIcon=document.createElement("span"); editIcon.className="edit-icon"; editIcon.textContent="✏️";
    editIcon.onclick=()=>openTaskModal(i);
    const deleteIcon=document.createElement("span"); deleteIcon.className="delete-icon"; deleteIcon.textContent="🗑️";
    deleteIcon.onclick=()=>openDeleteModal(i);
    iconContainer.appendChild(editIcon); iconContainer.appendChild(deleteIcon);
    li.appendChild(checkbox); li.appendChild(spanText); li.appendChild(iconContainer);
    taskList.appendChild(li);
  });
}

const taskModal=document.getElementById("taskModal"),
      taskInput=document.getElementById("taskInput"),
      taskIndexInput=document.getElementById("taskIndex"),
      taskModalTitle=document.getElementById("taskModalTitle"),
      deleteModal=document.getElementById("deleteTaskModal");

let taskToDelete=null;

addTaskBtn.onclick=()=>openTaskModal();
function openTaskModal(index=null){
  const tasks=JSON.parse(localStorage.getItem(STORAGE_TASKS)||"[]");
  if(index!==null){ taskModalTitle.textContent="Edit Task"; taskInput.value=tasks[index].text; taskIndexInput.value=index; }
  else{ taskModalTitle.textContent="Add Task"; taskInput.value=""; taskIndexInput.value=""; }
  taskModal.classList.add("show");
}

saveTaskBtn.onclick=()=>{
  const tasks=JSON.parse(localStorage.getItem(STORAGE_TASKS)||"[]");
  const index=taskIndexInput.value;
  if(index==="") tasks.push({text:taskInput.value,completed:false}); else tasks[index].text=taskInput.value;
  localStorage.setItem(STORAGE_TASKS,JSON.stringify(tasks));
  taskModal.classList.remove("show"); loadTasks();
};

closeTaskBtn.onclick=()=>taskModal.classList.remove("show");

function openDeleteModal(i){ taskToDelete=i; deleteModal.classList.add("show"); }
confirmDeleteTaskBtn.onclick=()=>{
  const tasks=JSON.parse(localStorage.getItem(STORAGE_TASKS)||"[]"); tasks.splice(taskToDelete,1);
  localStorage.setItem(STORAGE_TASKS,JSON.stringify(tasks)); deleteModal.classList.remove("show"); loadTasks();
};
cancelDeleteTaskBtn.onclick=()=>deleteModal.classList.remove("show");

window.onclick=(e)=>{
  if(e.target===taskModal) taskModal.classList.remove("show");
  if(e.target===deleteModal) deleteModal.classList.remove("show");
  if(e.target===vendorModal) vendorModal.classList.remove("show");
};

function initDashboard(){
  const ctx=document.getElementById("pipelineChart").getContext("2d");
  if(pipelineChart) pipelineChart.destroy();
  pipelineChart=new Chart(ctx,{
    type:"line",
    data:{
      labels:["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6"],
      datasets:[{label:"Deliveries",data:[5,8,6,10,7,9],borderColor:"#0a53c1",fill:false}]
    }
  });
}


searchInput.addEventListener("keyup",function(){
  const filter=this.value.toLowerCase();
  document.querySelectorAll("#vendorEngagementsTable tbody tr").forEach(r=>{
    r.style.display=r.innerText.toLowerCase().includes(filter)?"":"none";
  });
});

menuBtn.addEventListener("click",()=>menuDropdown.classList.toggle("show"));
document.addEventListener("click",e=>{ if(!e.target.closest(".menu-container")) menuDropdown.classList.remove("show"); });

window.onload=()=>{
  loadVendors(); loadTasks(); initDashboard();
  adminName.textContent=localStorage.getItem("adminName")||"Admin";
};
