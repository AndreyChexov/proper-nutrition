document.addEventListener('DOMContentLoaded', () => {

    /* tabs*/   
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');
        
        
    function hideTabsContent() {
    tabsContent.forEach( item => {
        item.style.display = "none";
    });


    tabs.forEach(item => {
        item.classList.remove('tabheader__item_active');
    });

    }      

    function showTabsContent(i = 0) {
    tabsContent[i].style.display = 'block';

    tabs[i].classList.add('tabheader__item_active');
    }

    hideTabsContent();
    showTabsContent();


    tabsParent.addEventListener('click', (event) => {
    let target = event.target;

    if(target && target.classList.contains('tabheader__item')) {
        tabs.forEach((item, i) => {
            if(target == item) {
            hideTabsContent();
            showTabsContent(i);
            }
        });
    }
    });

    // timer

    const deadLine = new Date('2023-12-31');

    function getTimeRemaining (endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date());
    let days = Math.floor(t / (1000 * 60 * 60 * 24));
    let hours = Math.floor((t/ (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((t / (1000 * 60)) % 60);
    let seconds = Math.floor((t / 1000) % 60);

    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
    }

    function getZero (num) {
    if ( num >= 0 && num < 10) {
        return `0${num}`;
    } else {
        return num;
    }
    }

    function setClock (selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds');

    let timeInterval = setInterval(updateClock, 1000);       


    updateClock();

        function updateClock () {
            const t = getTimeRemaining(endtime);
                    days.innerHTML = getZero(t.days);
                    hours.innerHTML = getZero(t.hours);
                    minutes.innerHTML = getZero(t.minutes);
                    seconds.innerHTML = getZero(t.seconds);
            if(t.total <= 0) {
                clearInterval(timeInterval);
            }

        }   
    
    }
    setClock('.timer', deadLine);

    // modal window

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modalWindow = document.querySelector('.modal');
        


        function openModal () {
        modalWindow.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(timerModal);
        }

    modalTrigger.forEach( btn => {
    btn.addEventListener('click', openModal);

    // modalClose.addEventListener('click', () => {
    //     // modalWindow.classList.add('hide');
    //     // modalWindow.classList.remove('show');
    //     modalWindow.style.display = 'none';
    //     document.body.style.overflow = 'visible';
    // }
    // );

    modalWindow.addEventListener('click', (event) => {

        if(event.target === modalWindow || event.target.getAttribute('data-close') == '') {
            modalWindow.style.display = 'none';
            document.body.style.overflow = 'visible';  
        }
    });

    document.addEventListener('keydown', (e) => {

        if(e.code === 'Escape' && modalWindow.style.display == 'block') {
            modalWindow.style.display = 'none';
            document.body.style.overflow = 'visible';    
        }
                
    });


    });


    const timerModal = setTimeout(openModal, 30000);


  //классы для карточек  

  class MenuCard {
     constructor (src, alt, title, descr, price, parentSelector, ... classes) {
       this.src = src;
       this.alt = alt;
       this.title = title;
       this.descr = descr;
       this.price = price;
       this.classes = classes;
       this.parent = document.querySelector(parentSelector);
       this.transfer = 2.4;
       this.changeToBYN();
     }

     changeToBYN() {
       this.price = parseInt((this.price * this.transfer) *100) / 100 + ' Byn/';
     }

     render() {
       const element = document.createElement('div');
       if(this.classes.length === 0) {
           this.element = 'menu__item';
           element.classList.add(this.element);
       }else {
           this.classes.forEach(className => {
                element.classList.add(className); 
            });
       }


       element.innerHTML = `
        <div class="menu__item">
            <img src=${this.src} alt=${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> день</div>
                </div>
            </div> `;

            this.parent.append(element);
     }

  }

   const getResourses = async (url) => {
        const result = await fetch(url);
        
        if(!result.ok) {
           throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
   };

    //  getResourses('http://localhost:3000/menu')
    //  .then(data => {
    //    data.forEach(({img, altimg, title, descr, price}) => {
    //        new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //    });
    //  });
     
    axios.get('http://localhost:3000/menu')
    .then(data => { 
        data.data.forEach(({img, altimg, title, descr, price}) => {
               new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
           });});
  



// Forms 

    const forms = document.querySelectorAll('form');

        forms.forEach(item => {
            bindPostForm(item);
        });

        const message = {
        loading: 'img/spinner.svg',
        succses: 'Спасибо! Мы скоро с Вами свяжемся',
        fealed: 'Что-то пошло не так...:('

        };

        const postForm = async (url, data) => {
            const result = await fetch(url, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: data
            });
            
            return await result.json();
        };

        function bindPostForm(form) {

            form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            
            `;
            form.append(statusMessage);

            //   const request = new XMLHttpRequest();
            //   request.open('POST', 'server.php');

            


            const formData = new FormData(form);

            const object = {};

            formData.forEach( function(key, value) {
                object[key] = value;
            });
            
            
            postForm('http://localhost:3000/requests', JSON.stringify(object))
            .then
                ( data => {

                    console.log(data);
                    modalThanks(message.succses);
                    
                    statusMessage.remove();
                    
                
            }).catch
                (()=> {

                    modalThanks(message.fealed);
            }).finally
                (()=> {
                    form.reset();
                    
            } );
        
            });
            }

            function modalThanks (message) {
                const prevModalDialog = document.querySelector('.modal__dialog');
                
                prevModalDialog.classList.add('hide');
                openModal();

                const thanksMod = document.createElement('div');
                thanksMod.classList.add('modal__dialog');

                thanksMod.innerHTML = `
                <div class = "modal__content">
                <div data-close class="modal__close">&times;</div>
                    <div class = "modal__title">${message}</div>
                </div>
                
                `;

                document.querySelector('.modal').append(thanksMod);

                setTimeout( () => {
                thanksMod.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');  
                
                }, 4000);

                
            }

        fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));

    // slider 


    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev =  document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current');
    let slideIndex = 1;

    showSlides(slideIndex);

    slider.style.positinion = 'relative';

    const indicator = document.createElement('ol');
    indicator.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicator);

    for(let i = 0; i < slides.length; i++) {
        const dots = document.createElement('li');
        dots.setAttribute('data-slide-ti', i + 1);
        dots.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        
        `;
      indicator.append(dots);
    }

    if(slides.length < 10 ) {
        total.textContent = `0${slides.length}`;
    } else{
        total.textContent = slides.length;
    }
    

    function showSlides (n) {
        if(n > slides.length) {
            slideIndex = 1;
        }

        if(n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach(item => {
          item.style.display = 'none';
        });
        
        slides[slideIndex - 1].style.display = 'block';

                                            
        if(slides.length < 10 ) {
            current.textContent = `0${slideIndex}`;
        } else{
            current.textContent = slideIndex;
        }

    }

    function plusSlides (n) {
        showSlides(slideIndex += n);
    }

     prev.addEventListener('click', () => {
         plusSlides(-1);
     });

     next.addEventListener('click', () => {
        plusSlides(1);
    });


   // calculatte

   let result = document.querySelector('.calculating__result span');
   let sex = 'male', weight, height, age, ratio = 1.375;

     function calcTotal() {
       if(!sex || !weight || !height || !age || ! ratio) {
           result.textContent = "_____";
           return;
       }

       if(sex === 'female') {
           result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
       } else {
           result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 *height) - (5.7 * age)) * ratio);
       }

     }

     calcTotal();
           
      
      function getStaticInfo (parentSelector, activeClass) {
           const elements = document.querySelectorAll(`${parentSelector} div`);

           elements.forEach(elem => {
               elem.addEventListener('click', (e) => {
                if(e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio',+e.target.getAttribute('data-ratio') );
                }  else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id') );
                }
  
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
  
                e.target.classList.add(activeClass);
                calcTotal();
             });
           });


           

      }

      getStaticInfo('#gender', 'calculating__choose-item_active');
      getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');


      function getDinamicInfo(selector) {
        const input = document.querySelector(selector);


        input.addEventListener('input', () => {

             if(input.value.match(/\D/g)) {
                input.style.borber = '3px solid red';
            }  else{
                input.style.borber = 'none';
            }
        

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight': 
                    weight = +input.value;
                    break;
                case 'age': 
                    age = +input.value;
                    break;
            }
    
            calcTotal();
    
          });

        
        }
      
      getDinamicInfo('#height');
      getDinamicInfo('#weight');
      getDinamicInfo('#age');


});




//     fetch('https://jsonplaceholder.typicode.com/todos/2')
//   .then(response => response.json())
//   .then(json => console.log(json));
    

    
//   fetch('https://jsonplaceholder.typicode.com/posts', {
//       method: 'POST',
//       body: JSON.stringify({ name: 'Alex'}),
//       headers: {
//           'content-type': 'application/json'
//       }
//   })
//   .then(response => response.json())
//   .then(json => console.log(json));