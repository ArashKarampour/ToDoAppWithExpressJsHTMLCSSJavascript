
function deleteTask(e){
    
    if(e.target.classList.contains("btn-del")){    
    e.preventDefault();
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
  document.getElementById("sec-c5d1").addEventListener('click', deleteTask);