var List = {
	items: [],
	numLeft: 0,
	numCompleted: 0,
	addItem: function(toDo){
		toDo.id = toDo.id || this.getNextNum();
		createItemView(toDo);
		this.items.push(toDo);
		this.updateCounters();
	},
	deleteItem: function(id){
		var idx = this.getItemIdx(id);
		this.items.splice(idx, 1);
		this.updateCounters();
	},
	toggleStatus: function(id){
		var idx = this.getItemIdx(id);
		var item = this.items[idx];
		this.items[idx].complete = !this.items[idx].complete;
		this.updateCounters();
	},
	getItemIdx: function(id){
		for (var i = 0; i < this.items.length; i++){
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
	getCompleted: function(){
		return this.items.filter(function(item){
			return item.complete;
		});
	},
	clearCompleted: function(){
		for (var i = this.items.length - 1; i >= 0; i--){
			if (this.items[i].complete){
				this.items.splice(i,1);
			}
		}
		this.updateCounters();
	},
	updateCounters: function(){
		this.numLeft = this.getRemaining().length;
		this.numCompleted = this.getCompleted().length;
		$("#num-left").text(this.numLeft + " items left");
		$("#num-complete").text("(" + this.numCompleted + ")");
		return this.numLeft;
	}
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

	if (item.complete){
		itemView.addClass("complete");
		checkBox.toggleClass("fa fa-check");
	}

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
		List.addItem({text: text, complete: false});
	}
};

var filterListHandler = function(view){
	switch (view){
		case "all":
			renderList(List.items);
			break;
		case "remaining":
			renderList(List.getRemaining());
			break;
		case "completed":
			renderList(List.getCompleted());
			break;
	}
};

var renderList = function(items){
	$("#items").empty();
	for (var i=0; i < items.length; i++){
		createItemView(items[i]);
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

	// event listener on filters
	$("#filter").on("click", "li", function(e){
		var $selected = $(this);
		var filter = $(this).attr("id");
		$("#filter li").removeClass("active");
		$selected.addClass("active");
		filterListHandler(filter);
	});

	// event listener on 'clear' btn
	$("#clear").on("click", function(e){
		List.clearCompleted();
		renderList(List.items);
	});
});

$(document).ready(function(){
	var items = JSON.parse(localStorage.items);
	if (items){
		for (var i = 0; i < items.length; i++){
			List.addItem(items[i]);
		}
	}
});

// store to-dos in localStorage when user navigates away
$(window).on('beforeunload', function(){
	localStorage.items = JSON.stringify(List.items);
});

// TODO: drag and drop to reorder
