
const inputTitle = document.getElementById('taskInputtitle');
const inputDescription = document.getElementById('taskInputdescription'); 
const startDate = document.getElementById('taskInputStartDate'); 
const endDate = document.getElementById('taskInputendDate'); 
const add = document.getElementById('addButton');  
let editingCard = null;
const list = document.getElementById('taskList');
async function mydata(query) {  
   const response = await fetch('https://sample-api-cyan.vercel.app/todos');
   const data = await response.json();
   list.innerHTML = '';
   // if get data and send to other function
   data.forEach(todo => {
       const card = createCard(todo.title, todo.description, todo._id ,todo.startDate, todo.endDate);
       list.appendChild(card);
   });
}
mydata();

function createCard(title, description, id , startDate , endDate) {
   const card = document.createElement("div");
   card.classList.add('card', 'col-md-4');
   card.setAttribute('data-id', id);
   const atitle =document.createElement("h5");
   atitle.classList.add('card-title');
   atitle.textContent= title;
   const cardDescription = document.createElement('p');
   cardDescription.classList.add('card-text', 'card-description');
   cardDescription.textContent = description;

    const cardEdit = document.createElement('button');
    cardEdit.classList.add('btn', 'btn-primary', 'card-edit');
    cardEdit.textContent = 'Edit';
    cardEdit.addEventListener('click', () => {
    inputTitle.value = title;
    inputDescription.value = description;
    editingCard = card;
    $('#myModal').modal('show');
    });
   card.appendChild(cardDescription);
   card.appendChild(cardEdit);
   card.appendChild(atitle);
   return card;
}
async function addtodo() {
   const title =inputTitle.value;
   const description =inputDescription.value;
   if(editingCard){
       const todoId = editingCard.getAttribute('data-id');
       console.log(todoId);
       await updateTodo(todoId, title, description);
   }
   else {
       await createTodo(title, description);     
   }  
   inputTitle.value = '';
   inputDescription.value = '';
   $('#myModal').modal('hide');  
}
async function createTodo(title, description) {
try {
   const response = await fetch(`https://sample-api-cyan.vercel.app/todo`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ title, description })
   });
   const newTodo = await response.json();
   const card = createCard(newTodo.title, newTodo.description, newTodo._id);
   list.appendChild(card);
} 
catch (error) {
   console.error('Error creating todo:', error);
}
}


async function updateTodo(todoId, title, description){
   console.log(todoId , title , description);
   try {
   const response = await fetch(`https://sample-api-cyan.vercel.app/todo/${todoId}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ title, description })
   });
   const updatedTodo = await response.json();
   const card = createCard(updatedTodo.title, updatedTodo.description, updatedTodo._id);
   list.replaceChild(card , editingCard);
   editingCard = null;
} catch (error) {
   console.error('Error creating todo:', error);
}
}

document.getElementById("addButton").addEventListener("click", addtodo);
