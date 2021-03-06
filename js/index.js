// Model

var Model = {
  tasks: [
    {
      text: 'hello',
      status: 'todo',
      id: '1234'
    },
    {
      text: 'world',
      status: 'doing',
      id: '4321'
//1. Added comma //
    },
    {
      text: '!!',
      status: 'done',
      id: '9999'
    }
  ],

  getTodos: function() {
    return this.tasks.filter(function(task) {
      return task.status === 'todo';
    });
  },

  getDoings: function() {
    return this.tasks.filter(function(task) {
      return task.status === 'doing';
    });
  },

  getDones: function() {
//2. Added task parameter//
    return this.tasks.filter(function(task) {
      return task.status === 'done';
    });
  },

  getAllTasks: function() {
    return {
      todos: this.getTodos(),
      doings: this.getDoings(),
      dones: this.getDones()
    };
  },

  addTask: function(text) {
    this.tasks.push({
      text: text,
      status: 'todo',
      id: Date.now().toString().substr(-4)
    });
  },

  deleteTask: function(id) {
    this.tasks = this.tasks.filter(function(task) {
//5. modified expression so item set for deletion is only affected.
      return id !== task.id;
    });
  },

  moveTask: function(id, status) {
    this.tasks = this.tasks.map(function(task) {
      if (task.id === id) {
        return {
          text: task.text,
          status: status,
          id: id
        };
      }
      return task;
    })
  }
};

// View

var View = {
  template: undefined,

  init: function() {
    var source = $('#board-template').html();
    this.template = Handlebars.compile(source);
  },

  renderBoard: function() {
    $('#todoInput').val('');
    $('#khanban').html(this.template(Model.getAllTasks()));
  }
}

// Controller

var Controller = {
  init: function() {
    View.renderBoard();
    $('#addTaskForm').on('submit', this.handleSubmit);
    $('#load').on('click', this.handleLoad);
    $('#khanban').on('click', '.delete', this.handleDelete);
    $('#khanban').on('dragenter dragover', '.column', this.handleDrag);
    document.querySelector('#khanban').addEventListener('dragstart', this.handleDragStart);
    //3. Corrected spelling!//
    document.querySelector('#khanban').addEventListener('drop', this.handleDrop);
  },

  handleSubmit: function(event) {
    var value = $('#todoInput').val();
    Model.addTask(value);
    View.renderBoard();
  //6. Moved prevent default to the bottom of the function//
    event.preventDefault();

  },

  handleDelete: function() {
    var id = $(this).parent().attr('id');
    Model.deleteTask(id);
    View.renderBoard();
  },

  handleDragStart: function(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  },

  handleDrag: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  handleDrop: function(event) {
    var column = $(event.target).closest('.column');
//4. length is not a function//
    if (column.length > 0) {
      var id = event.dataTransfer.getData('text');
      Model.moveTask(id, column.attr('id'));
      View.renderBoard();
    }
  },

  handleLoad: function() {
    $.ajax({
      type: 'GET',
      url: 'http:/jacobfriedmann.com:3000/todos?num=1',
      success: function(data) {
          //7. Data is an array, removed tasks//
        data.forEach(function(task){
          //8. Need to specify Array Key. Added Text.
          Model.addTask(task.text);
        });
        View.renderBoard();
      }
    });
  }
};

function setup() {
  View.init();
  Controller.init();
}

$(document).ready(setup);
