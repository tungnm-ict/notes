'use strict';

angular.module('app').component('noteDetail', {
	templateUrl: '/src/note/detail.html',
	bindings: {
		session: '=',
		note: '=',
	},
	controller: function(Note, $location) {
		this.$onInit = function () {
			var arr = [];
			for (var i = this.note.total_version; i > 0; i--) {
				arr.push(i);
			}
			this.ver_list=arr;
			this.version= this.note.version;
		}
		var self= this;
		this.changeVersion = function() {
			Note.version({
				note_id: this.note.note_id,
				version: this.version,
			}).$promise.then((note) => {
				this.note=note;
			}).catch(reason => {
				this.error = 'Error occurred while get version the note.';
			});
		};
		
	},
});
