document.addEventListener('DOMContentLoaded', () => {

	const contactsArr = JSON.parse(localStorage.getItem('contactsArr'));
	const contactsRow = document.querySelector('.contacts__row');

	//animate slidetoggle
	const slideToggleBabel = () => {
		contactsRow.addEventListener('click', event => {
			const target = event.target;
			if (target.classList.contains('contacts-item-header')) {
				target.parentNode.querySelector('.contacts-item-content').classList.toggle('curr');
				target.classList.toggle('curr-img');
			}
		});
	};
	slideToggleBabel();

	let contactsData;

	const requestData = () => {
		if (contactsArr.length !== 0) {
			contactsData = contactsArr;
		} else {
			const request = new XMLHttpRequest();
			request.open('GET', './src/users.json');
			request.setRequestHeader('Content-type', 'application/json');
			request.send();
			request.addEventListener('readystatechange', () => {
				if (request.readyState === 4 && request.status === 200) {
					contactsData = JSON.parse(request.responseText);
					localStorage.clear();
					localStorage.setItem('contactsArr', JSON.stringify(contactsData));
				}
			});
		}
	};
	requestData();
	const render = () => {
		contactsRow.textContent = '';

		if (contactsData == 0) {
			requestData();
		}

		contactsData.forEach(item => {
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
			contactsRow.append(newItem);
		});
	};
	render();

	contactsRow.addEventListener('click', event => {
		const target = event.target;
		const btnsRemove = document.querySelectorAll('.contacts-item-content__remove');
		const btnsEdit = document.querySelectorAll('.contacts-item-content__edit');
		const btnsSave = document.querySelectorAll('.contacts-item-content__save');
		const contactItemsContent = document.querySelectorAll('.contacts-item-content');
		if (target.classList.contains('contacts-item-content__remove')) {
			btnsRemove.forEach(item => {
				contactsData.forEach((elem, i) => {
					if (target === item) {
						if (target.parentNode.parentNode.id == elem.id) {
							contactsData.splice(i, 1);
							localStorage.clear();
							localStorage.setItem('contactsArr', JSON.stringify(contactsData));
						}
						render();
					}
				});
			});
		} else if (target.classList.contains('contacts-item-content__edit')) {
			btnsEdit.forEach((item, index) => {
				contactItemsContent.forEach((elem, i) => {
					if (target === item) {
						if (index === i) {
							elem.classList.add('lock');
							elem.querySelector('.contacts-item-content__cancel').removeAttribute('disabled');
							elem.querySelector('.contacts-item-content__save').removeAttribute('disabled');
							let oldName = elem.parentNode.querySelector('.contacts-item-header__title').textContent;
							elem.parentNode.querySelector('.contacts-item-header__title').textContent = '';
							elem.parentNode.querySelector('.contacts-item-header__title').insertAdjacentHTML(
								'beforeend',
								`<input type="text" name="name" id="" value="${oldName}">`);
							const phoneItems = contactItemsContent[i].querySelectorAll('.telephone__number');
							let itemText;
							phoneItems.forEach(item => {
								itemText = item.textContent;
								item.textContent = '';
								item.insertAdjacentHTML('beforeend',
									`<input type="text" name="${item.dataset.name}" id="" value="${itemText}">`);
							});
						}
					}
				});
			});
		} if (target.classList.contains('contacts-item-content__cancel')) {
			render();
		} else if (target.classList.contains('contacts-item-content__save')) {
			btnsSave.forEach((item, index) => {
				contactItemsContent.forEach((elem, i) => {
					if (target === item) {
						if (index === i) {
							elem.classList.remove('lock');
							const phoneItems = contactItemsContent[i].querySelectorAll('.telephone__number');
							let elementText;
							phoneItems.forEach(element => {
								elementText = element.querySelector('input').value;
								contactsData.forEach(e => {
									if (e.id == element.parentNode.parentNode.parentNode.id) {
										e[element.dataset.name] = elementText;
										e.name = elem.parentNode.querySelector('input[name=name]').value;
									}
								});
							});
						}
					}
				});
			});
			localStorage.clear();
			localStorage.setItem('contactsArr', JSON.stringify(contactsData));
			render();
		}
	});

});






// class Contacts {
// 	constructor() {

// 	}

// 	init() {

// 	}
// }

// const contacts = new Contacts();
// contacts.init();


// import blockOne from './modules/blockOne';
// // contacts
// blockOne();
