
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("add-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  //setting today's date by default:
  let dueDate = new Date();
  dueDate = dueDate.getFullYear() + '-' + ('0' + (dueDate.getMonth() + 1)).slice(-2) + '-' + ('0' + dueDate.getDate()).slice(-2);  
  document.getElementById("dueDate").value = dueDate;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}        

const myform = document.getElementById("add-task");
myform.addEventListener('submit',function (event) {
    event.preventDefault();    
    // console.log(formdata.get("comment"));
    //console.log(document.getElementById("comment").innerHTML.length);
    if(document.getElementById("comment").value.length == 0){
        document.querySelector("#comment").value = " ";
        // document.querySelector("#comment").innerHTML = " ";
        // document.querySelector("#comment").innerText = " ";
        // console.log(document.querySelector("#comment").innerHTML);
        // console.log(document.querySelector("#comment").innerText);
    }
    const formdata = new FormData(myform);
    const formdata2 = {"subject": formdata.get("subject"),"priority":formdata.get("priority"),"dueDate":formdata.get("dueDate"),"comment":formdata.get("comment")};
    //console.log(formdata2);
    // for (var value of formdata.values()) {
    //     console.log(value);
    //   }
    // console.log(formdata);
    //console.log(myform.elements.submit); 
    fetch("/api/todo/tasks/add",{
        method : "POST",
        body: JSON.stringify(formdata2),
        credentials: "same-origin",
        headers :{
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
      if(!response.ok) {
        response.json()
        .then(msg => alert(`Coulden't add task with error: ${msg}`));        
      }
      else{
        return response.json();
      }
    })
    .then(task => {
        //console.log(task);
      if(task){
        if(task.priority == "normal"){
            const li = `<li>
            <span style="font-size: 1.5rem;margin-right:120px" class="u-text-black">
              ${task.subject}
            </span>
            <br>
            <span>
              <a class="my-btn btn-del" href="/api/todo/tasks/delete/${task._id }">Delete</a>
            </span>
            <span>
              <a class="my-btn btn-upd" href="/api/todo/tasks/update/${task._id }">Update</a>
            </span>
            <span>
              <a class="my-btn btn-don" href="/api/todo/tasks/done/${task._id }">Done</a>
            </span>
          </li>`;
          document.querySelector(".ulNormal").innerHTML += li;
          alert("Task added successfully!");
        }
        else if(task.priority == "high"){
            const li = `<li>
            <span style="font-size: 1.5rem" class="u-text-black">
               ${task.subject}
            </span>
            <br>
            <span>
              <a class="my-btn btn-del" href="/api/todo/tasks/delete/${task._id }">Delete</a>
            </span>
            <span>
              <a class="my-btn btn-upd" href="/api/todo/tasks/update/${task._id }">Update</a>
            </span>
            <span>
              <a class="my-btn btn-don" href="/api/todo/tasks/done/${task._id }">Done</a>
            </span>
            </li>`;
            document.querySelector(".ulHigh").innerHTML += li;
            alert("Task added successfully!");
        }else{
            const li = `<li>
            <span style="font-size: 1.5rem" class="u-text-black">
               ${task.subject}
            </span>
            <br>
            <span>
              <a class="my-btn btn-del" href="/api/todo/tasks/delete/${task._id }">Delete</a>
            </span>
            <span>
              <a class="my-btn btn-upd" href="/api/todo/tasks/update/${task._id }">Update</a>
            </span>
            <span>
              <a class="my-btn btn-don" href="/api/todo/tasks/done/${task._id }">Done</a>
            </span>
            </li>`;
            document.querySelector(".ulVeryHigh").innerHTML += li;
            alert("Task added successfully!");
        }
      }
    })
    .catch(e => alert(`Coulden't add task with error: ${e}`));
        
    
});


//let deletLinks = document.querySelectorAll(".btn-del");
// document.querySelectorAll(".ul-task").forEach( ul => {
//     ul.addEventListener('change', function () {
//         deletLinks = document.querySelectorAll(".btn-del");
//     });
// } );

// deletLinks.forEach( deletLink => { 
//     deletLink.addEventListener('click', function (e) {
    //Using event deligation for delete (because of adding tasks with fetch method):
function deleteTask(e){
  if(e.target.classList.contains("btn-del")){
  e.preventDefault();
  //e.stopPropagation();
  const anchor = e.target;  
  //console.log(this.getAttribute("href")); // gives the href value attribute
  //console.log(this.href); //give the whole link
  // const rout = this.getAttribute("href");
  // console.log(rout);
  if(confirm("Are you sure you want to delete the Task?")){
  fetch(`${anchor.getAttribute("href")}`,{ 
      method: "DELETE",
      credentials:"same-origin",
      // headers :{
      //     'Content-Type': 'application/json'
      // }
  })
  .then(res => { 
      if(!res.ok){
          res.json()
          .then(msg => alert(`Coulden't delete task with error: ${msg}`));            
      }else{
        anchor.parentElement.parentElement.style.animationName = "delete";
        anchor.parentElement.parentElement.style.animationPlayState = "running";
        anchor.parentElement.parentElement.addEventListener("animationend",  function () {
            this.remove();
        });
        //this.parentElement.parentElement.remove();
        res.json()
        .then(deletedTask => alert(`Task with title: "${deletedTask.subject}" deleted successfully!`));
      }
      })    
  .catch(e => alert(`Coulden't delete task with error: ${e}`));
  }
}
}

document.getElementById("sec-ef11").addEventListener('click', deleteTask);
// })
// });

function doneTask(e){
  if(e.target.classList.contains("btn-don")){
    e.preventDefault();
    const anchor = e.target;

    fetch(`${anchor.getAttribute("href")}`,{ 
      method: "PUT",
      credentials:"same-origin",

    })
    .then(res => { 
        if(!res.ok){
            res.json()
            .then(msg => alert(`Coulden't done task with error: ${msg}`));            
        }else{
          anchor.parentElement.parentElement.style.animationName = "done";
          anchor.parentElement.parentElement.style.animationPlayState = "running";
          anchor.parentElement.parentElement.addEventListener("animationend",  function () {
              this.remove();
          });
          res.json()
          .then(doneTask => alert(`Task with title: "${doneTask.subject}" done successfully!`));
        }
        })    
    .catch(e => alert(`Coulden't done task with error: ${e}`));
  
  }
}

document.getElementById("sec-ef11").addEventListener('click', doneTask);
