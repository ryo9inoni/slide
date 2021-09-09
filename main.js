import MODE from '../config/mode'; 

let slideAll = document.querySelectorAll('.slide');
let slideItemAll = [];
let pagerItemAll = [];
let colorAll = [];
let circleAll = [];
let timerIdAll = {};


export default class Slide {
  constructor() {
    this.Init();
  }

  Init() {
    this.CreateEl();
    
    [...pagerItemAll].forEach(el => {
      el.addEventListener('click', this.Select.bind(this));
    });
  }

  CreateEl() {
    // html作成
    for (let i = 0; i < slideAll.length; i++) {
      const pager = document.createElement('div');
      pager.setAttribute('class', 'pager');
      slideAll[i].appendChild(pager);
      timerIdAll[slideAll[i].id] = [];

      const list = document.createElement('ul');
      list.setAttribute('class', 'pager__list');
      pager.appendChild(list);

      slideItemAll = slideAll[i].querySelectorAll('.slide__item');
      for (let j = 0;  j < slideItemAll.length; j++) {
        slideItemAll[j].setAttribute('data-index', j);
        if (j == slideItemAll.length - 1) {
          slideItemAll[j].setAttribute('data-show', true);
        } else {
          slideItemAll[j].setAttribute('data-show', false);
        }
        
        const item = document.createElement('li');
        item.setAttribute('class', 'pager__item');
        item.setAttribute('data-index', j);
        item.setAttribute('data-color', slideItemAll[j].dataset.color);
        list.appendChild(item);
        if (j == slideItemAll.length - 1) {
          item.setAttribute('data-show', true);
        } else {
          item.setAttribute('data-show', false);
        }
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'pager__svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        item.appendChild(svg);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '8');
        circle.setAttribute('cy', '8');
        circle.setAttribute('r', '7');
        circle.style.stroke = item.dataset.color;
        svg.appendChild(circle);
        
        const btn = document.createElement('span');
        btn.setAttribute('class', 'pager__btn');
        btn.style.backgroundColor = slideItemAll[j].dataset.color;
        if (slideItemAll[j].dataset.src !== undefined) {
          btn.style.backgroundImage = 'url(/assets/img/'+slideItemAll[j].dataset.src+')';
        }
        item.appendChild(btn);
      }
    }

    circleAll = document.querySelectorAll('.pager__svg circle');
    slideItemAll = document.querySelectorAll('.slide__item');
    pagerItemAll = document.querySelectorAll('.pager__item');
    
    for (let i = 0; i < slideItemAll.length; i++) { 
      colorAll.push(slideItemAll[i].dataset.color);
    }
  }

  Update(slide) {　
    const model = (slide) => {
      if (slide.dataset.auto === 'true') {
        const itemAll = slide.querySelectorAll('.pager__item');
        const lastIndex = itemAll.length - 1;
        const slideCurrent = this.getShowItem(slide, 'slide');        
        const pagerCurrent = this.getShowItem(slide, 'pager');
        const slideIndex = Number(slideCurrent.dataset.index);
        const pagerIndex = Number(pagerCurrent.dataset.index);
        const slideNext = slideIndex == lastIndex ? this.getItem(slide, 0, 'slide') : this.getItem(slide, slideIndex + 1, 'slide');
        const pagerNext = pagerIndex == lastIndex ? this.getItem(slide, 0, 'pager') : this.getItem(slide, pagerIndex + 1, 'pager');
        this.Switch(slideNext, slideCurrent);
        this.Switch(pagerNext, pagerCurrent);
        this.Animation(pagerNext, pagerCurrent, slide.dataset.duration);
      } 
      setTimeout(() => { model(slide); }, slide.dataset.duration);
    }
    for (let i = 0; i < slide.length; i++) model(slide[i]);
  }

  getItem(slide, index, type) {
    return slide.querySelector('.' + type + '__item[data-index="' + index + '"]');
  }

  getShowItem(slide, type) {
    return slide.querySelector('.' + type + '__item[data-show="true"]');
  }

  Switch (on, off) {
    on.setAttribute('data-show', true);
    off.setAttribute('data-show', false);
  }

  Animation(on, off, duration) {
    const circle = on.querySelector('circle');
    circle.style.animationDuration = duration + 'ms';
  }

  Select(e) {
    let parent = null;
    let index = 0;
    let duration = 500;
    let slideSelect = null;
    let slideCurrent = null;
    let pagerSelect = null;
    let pagerCurrent = null;
    if (e.currentTarget.dataset.show === 'false') {
      new Promise((resolve) => {
        parent = e.currentTarget.closest('.slide');
        index = Number(e.currentTarget.dataset.index);
        slideSelect = this.getItem(parent, index, 'slide');
        slideCurrent = this.getShowItem(parent, 'slide');
        pagerSelect = this.getItem(parent, index, 'pager');
        pagerCurrent = this.getShowItem(parent, 'pager');
        setTimeout(resolve, 10);
      }).then(() => {
        this.Switch(slideSelect, slideCurrent);
        this.Switch(pagerSelect, pagerCurrent);
        this.Animation(pagerSelect, pagerCurrent, duration);
        this.Restart(parent);
      });
    }
  }

  Restart(slide) {
    const active = () => {
      slide.setAttribute('data-auto', true);
      timerIdAll[slide.id] = [];
    }
    const timerId = setTimeout(active, 10000);
    timerIdAll[slide.id].push(timerId);
    for (let i = 0; i < timerIdAll[slide.id].length - 1; i++) {
      clearTimeout(timerIdAll[slide.id][i]);
    }
    slide.setAttribute('data-auto', false);
  }
}