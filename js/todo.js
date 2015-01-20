var List = {
	items: [],
	numLeft: 0,
	numDone: 0,
	currentView: "todo",
	addItem: function(text){
		var toDo = new Item(text);
		createItemView(toDo);
		toDo.id = this.getNextNum();
		this.items.push(toDo);
		this.updateNumLeft();
	},
	deleteItem: function(id){
		var idx = this.getItemIdx(id);
		this.items.splice(idx, 1);
		this.updateNumLeft();
		this.updateNumDone();
	},
	toggleStatus: function(id){
		var idx = this.getItemIdx(id);
		var item = this.items[idx];
		this.items[idx].complete = !this.items[idx].complete;
		this.updateNumLeft();
		this.updateNumDone();
	},
	getItemIdx: function(id){
		for (var i=0; i < this.items.length; i++){
			if (this.items[i].id == id) {
				return i;
			}
		}
	},
	getRemaining: function(){
		return this.items.filter(function(item){
			return !item.complete;
		});
	},
	getComplete: function(){
		return this.items.filter(function(item){
			return item.complete;
		});
	},
	updateNumLeft: function(){
		this.numLeft = this.getRemaining().length;
		$("#counter").text(this.numLeft + "  tasks to do.");
		return this.numLeft;
	},
	updateNumDone: function(){
		this.numLeft = this.getComplete().length;
		// counter on Done page will be static
		return this.numDone;
	}
};

// model for item
var Item = function(text) {
	this.id = null;
	this.text = text;
	this.complete = false;
};

// utility function to generate unique ID
(function(){
		this.counter = 0;
		this.getNextNum = function(){
			this.counter += 1;
			return this.counter;
		};
}).apply(List);

var createItemView = function(item){

	var itemView = $('<div></div>', {
		'class': 'todo',
		text: item.text
	});

	var checkBox = $('<div></div>', {
		'class': 'checkbox',
	});

	checkBox.click(function(){
		List.toggleStatus(item.id);
		itemView.toggleClass("complete");
		checkBox.toggleClass("fa fa-check");
	});

	var deleteButton = $('<span></span>', {
		'class': 'delete',
		text: 'X',
	});

	deleteButton.click(function(){
		itemView.remove();
		List.deleteItem(item.id);
	});

	itemView.prepend(checkBox);
	itemView.append(deleteButton);

	$('#items').append(itemView);
};

var addItemHandler = function(){
	var text = $("#input-field").val();
	if (text){
		$("#input-field").val('');
		List.addItem(text);
	}
};

$(document).ready(function(){
	// event listeners for adding new item
	$("#add-button").click(addItemHandler);
	$("#input-field").keypress(function(e){
		if (e.which == 13){
			addItemHandler();
		}
	});
});