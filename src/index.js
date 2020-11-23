document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	class Contacts {
		constructor(row, form, inputs) {
			this.contactsRow = document.querySelector(row);
			this.contactsData = JSON.parse(localStorage.getItem('contactsArr'));
			this.form = document.querySelector(form);
			this.formInputs = document.querySelectorAll(inputs);
		}

		//Requesting data from the server
		requestData() {
			const request = new XMLHttpRequest();
			request.open('GET', './src/users.json');
			request.setRequestHeader('Content-type', 'application/json');
			request.send();
			request.addEventListener('readystatechange', () => {
				if (request.readyState === 4 && request.status === 200) {
					this.contactsData = JSON.parse(request.responseText);
					this.render();
					this.updateStorage();
				}
			});
		}

		updateStorage() {
			localStorage.clear();
			localStorage.setItem('contactsArr', JSON.stringify(this.contactsData));
		}

		render() {
			this.contactsRow.textContent = '';
			if (this.contactsData == null || this.contactsData.length === 0) {
				this.requestData();
			} else {
				this.contactsData.forEach(this.createItem, this);
				this.updateStorage();
			}
			this.btnsRemove = document.querySelectorAll('.contacts-item-content__remove');
			this.btnsEdit = document.querySelectorAll('.contacts-item-content__edit');
			this.btnsSave = document.querySelectorAll('.contacts-item-content__save');
			this.contactItemsContent = document.querySelectorAll('.contacts-item-content');
			this.formInputs.forEach(item => {
				item.value = '';
			});
			document.querySelector('.contacts-top__add-link').classList.remove('active');
			document.querySelector('.contacts-top__newcontact').classList.remove('active');
		}

		createItem(item) {
			const newItem = document.createElement('div');
			newItem.classList.add('contacts__item', 'contacts-item');
			newItem.id = item.id;

			newItem.insertAdjacentHTML('beforeend', `
			<div class="contacts-item__header contacts-item-header">
				<div class="contacts-item-header__title">${item.name}</div>
				<div class="contacts-item-header__img">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M1 10L7 4L13 10" stroke="#888888" stroke-width="1.5"></path>
					</svg>
				</div>
			</div>
			<div class="contacts-item__content contacts-item-content">
				<div class="contacts-item-content__phone telephone">
					<div class="telephone__title">Телефон</div>
					<div class="telephone__number" data-name="phone">${item.phone}</div>
				</div>
				<div class="contacts-item-content__phone telephone">
					<div class="telephone__title">Почта</div>
					<div class="telephone__number" data-name="email">${item.email}</div>
				</div>
				<div class="contacts-item-content__phone telephone">
					<div class="telephone__title">Сайт</div>
					<div class="telephone__number" data-name="website">${item.website}</div>
				</div>
				<div class="contacts-item-content__phone telephone">
					<div class="telephone__title">Никнейм</div>
					<div class="telephone__number text" data-name="username">${item.username}</div>
				</div>
				<button class="contacts-item-content__edit" >
				<i class="fa fa-pencil" aria-hidden="true"></i> Изменить</button>
				<button class="contacts-item-content__save" disabled="true">
				<i class="fa fa-floppy-o" aria-hidden="true"></i> Сохранить</button>
				<button class="contacts-item-content__cancel" disabled="true">
				<i class="fa fa-ban" aria-hidden="true"></i> Отмена</button>
				<button class="contacts-item-content__remove">
				<i class="fa fa-trash" aria-hidden="true"></i> Удалить</button>
			</div>
				`);
			this.contactsRow.append(newItem);
		}

		deleteItem(elem) {
			this.contactsData.splice(elem, 1);
			this.render();
		}

		editItem(elem, i) {
			elem.classList.add('lock');
			elem.querySelector('.contacts-item-content__cancel').removeAttribute('disabled');
			elem.querySelector('.contacts-item-content__save').removeAttribute('disabled');
			const oldName = elem.parentNode.querySelector(
				'.contacts-item-header__title').textContent;
			elem.parentNode.querySelector('.contacts-item-header__title').textContent = '';
			elem.parentNode.querySelector('.contacts-item-header__title').insertAdjacentHTML(
				'beforeend',
				`<input type="text" name="name" id="" value="${oldName}">`);
			const phoneItems = this.contactItemsContent[i].querySelectorAll(
				'.telephone__number');
			let itemText;
			phoneItems.forEach((item, num) => {
				itemText = item.textContent;
				item.textContent = '';
				item.insertAdjacentHTML('beforeend',
					`<input type="text" name="${item.dataset.name}" id="${num}" value="${itemText}">`
				);
			});
		}

		saveItem(elem, i) {
			elem.classList.remove('lock');
			const phoneItems = this.contactItemsContent[i].querySelectorAll(
				'.telephone__number');
			let elementText;
			phoneItems.forEach(element => {
				elementText = element.querySelector('input').value;
				this.contactsData.forEach(e => {
					if (e.id == element.parentNode.parentNode.parentNode.id) {
						e[element.dataset.name] = elementText;
						e.name = elem.parentNode.querySelector('input[name=name]').value;
					}
				});
			});
		}

		addNewContact(e) {
			e.preventDefault();
			const newContactsDate = {};
			this.formInputs.forEach(item => {
				newContactsDate[item.name] = item.value;
			});
			newContactsDate.id = this.contactsData.length;
			this.contactsData.push(newContactsDate);
			console.log(this.contactsData);
			this.updateStorage();
			this.render();
		}

		handler() {
			this.contactsRow.addEventListener('click', event => {
				const target = event.target;
				if (target.classList.contains('contacts-item-content__remove')) {
					this.btnsRemove.forEach(item => {
						this.contactsData.forEach((elem, i) => {
							if (target === item) {
								if (target.parentNode.parentNode.id == elem.id) {
									console.log(target.parentNode.parentNode.id);
									this.deleteItem(i);
								}
							}
						});
					});
				} else if (target.classList.contains('contacts-item-content__edit')) {
					this.btnsEdit.forEach((item, index) => {
						this.contactItemsContent.forEach((elem, i) => {
							if (target === item) {
								if (index === i) {
									this.editItem(elem, i);
								}
							}
						});
					});
				} if (target.classList.contains('contacts-item-content__cancel')) {
					this.render();
				} else if (target.classList.contains('contacts-item-content__save')) {
					this.btnsSave.forEach((item, index) => {
						this.contactItemsContent.forEach((elem, i) => {
							if (target === item) {
								if (index === i) {
									this.saveItem(elem, i);
								}
							}
						});
					});
					this.updateStorage();
					this.render();
				}
				if (target.classList.contains('contacts-item-header')) {
					this.animate(target);
				}
			});
			document.querySelector('.contacts-top__add-link').addEventListener('click', event => {
				event.preventDefault();
				const target = event.target;
				target.closest('.contacts-top__add-link').classList.toggle('active');
				target.parentNode.parentNode.parentNode.parentNode.querySelector(
					'.contacts-top__newcontact').classList.toggle('active');
			});
			this.form.addEventListener('submit', this.addNewContact.bind(this));
		}

		//animate slidetoggle
		animate(target) {
			target.parentNode.querySelector('.contacts-item-content').classList.toggle('curr');
			target.classList.toggle('curr-img');
		}

		init() {
			this.render();
			this.handler();
		}
	}


	const contacts = new Contacts('.contacts__row', '.form', '.form__input');

	contacts.init();
});