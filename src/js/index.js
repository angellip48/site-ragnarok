
 import '../styles/main.scss'
 import '../index.html'

 import 'swiper/swiper.min.css'
// import Swiper, { Navigation } from 'swiper'
// Swiper.use([Navigation])
import Swiper from 'swiper/bundle'


import {languages} from './languages'

const classes = {
    opened: 'opened',
    hidden: 'hidden',
    active: 'active',
}

let isPlay = false

const checkboxes = {
    requirements: ['minimum', 'recommended'],
    versions: ['standard', 'limited']
}

const values = [
    {
     price: 19.99,
     title: 'Standard Edition',
    },
    {
     price: 18.99,
     title: 'Standard Edition',
    },
    {
     price: 29.99,
     title: 'Digital Deluxe Edition',
    }
]

const menuButton = document.querySelector('.header-menu__button')
const header = document.querySelector('.header')
const menuLink = document.querySelectorAll('.menu-link')
const video = document.getElementById('video')
const videoButton = document.querySelector('.video-btn')
const checkbox = document.querySelectorAll('.checkbox')
const faqItem = document.querySelectorAll('.faq-item')
const sections = document.querySelectorAll('.section')
const language = document.querySelectorAll('.language')
const currentLanguage = document.querySelectorAll('.current-lang')
const buyButton = document.querySelectorAll('.buy-button')
const modal = document.querySelector('.modal')
const modalTitle = document.querySelector('.modal-subtitle')
const modalPrice = document.querySelector('.modal-total__price')
const modalClose = document.querySelector('.modal-close')
const overlay = document.querySelector('.overlay')

//==//




const toggleMenu = () => {
    header.classList.toggle(classes.opened)
}

const scrollToSection = (e) => {
    e.preventDefault()
    const href = e.target.getAttribute('href')
    if (!href && !href.starsWith('#')) return
    const section = href.slice(1)// remove #
    const top = document.getElementById(section)?.offsetTop || 0
    window.scrollTo({
        top: top,
        behavior: 'smooth'
    })
}

const formatValue = (value) => (
    value < 10 ? `0${value}` : value
)


const getTimerValues = (diff) => {
    return {
        seconds: (diff % (1000 * 60)) / 1000,
        minutes: (diff % (1000 * 60 * 60)) / (1000 * 60),
        hours: (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        days: diff / (1000 * 60 * 60 * 24),
    }
}



const startTimer = (date) => {

    const id = setInterval(() => {
        const diff = new Date(date).getTime() - new Date().getTime()
        const values = getTimerValues(diff)

        if (diff < 0) {
            clearInterval(id)
            return
        }

        Object.entries(values).forEach(([key, value]) => {
            document.getElementById(key).textContent = formatValue(Math.floor(value))
        })
    }, 1000)
}


const handleVideo = ({ target }) => {
    const info = target.parentElement
    isPlay = !isPlay
    info.classList.toggle(classes.hidden, isPlay)
    target.innerText = isPlay ? 'Pause' : 'Play'
    isPlay ? video.play() : video.pause()
}

const handleCheckbox = ({ currentTarget: { checked, name } }) => {
    const { active } = classes
    const value = checkboxes[name][Number(checked)]
    // console.log('value :>> ', value);
    const list = document.getElementById(value)
    const tabs = document.querySelectorAll(`[data-${name}]`)
    const siblings = list.parentElement.children

    for (const item of siblings) {
        item.classList.remove(active)
    }

    for (const tab of tabs) {
        tab.classList.remove(active)
        tab.dataset[name] === value && tab.classList.add(active)
    }

    list.classList.add(active)
}

const initSlider = () => {
    new Swiper('.swiper', {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 20,
        initialSlide: 2,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints:{
            0:{
               slidesPerView: 0.5,
            },
            530:{
               slidesPerView: 1,
            },
            800:{
               slidesPerView: 1.5,
            },
            1050:{
               slidesPerView: 2,
            },
            1350:{
                slidesPerView: 2.5,
            },
            1600:{
              slidesPerView: 3,
          },
        }
    })
}

const handleFaqItem = ({ currentTarget: target }) => {
    target.classList.toggle(classes.opened)
    const isOpened = target.classList.contains(classes.opened)
    const height = target.querySelector('p').clientHeight
    const content = target.querySelector('.faq-item__content')
    content.style.height = isOpened ? `${height}px` : '0px'
}

const handleScroll = () => {
    const { scrollY, innerHeight } = window
    sections.forEach((section) => {
        if (scrollY > section.offsetTop - innerHeight / 1.5) {
            section.classList.remove(classes.hidden)
        }
    })
}

const setText = () => {
    const lang = localStorage.getItem('lang') || 'en'
    const content = languages[lang]
    currentLanguage.forEach((item) => {
        lang === 'ru' ? item.innerText = 'Русский' : item.innerText = 'English'
    })
    Object.entries(content).forEach(([key, value]) => {
        const items = document.querySelectorAll(`[data-text='${key}']`)
        items.forEach((item) => (item.innerText = value))
    })
}


const toggleLanguage = ({target}) => {
const{ lang } = target.dataset
if(!lang) return
localStorage.setItem('lang', lang)
setText()
}

const handleBuyButton = ({ currentTarget: target }) => {
    const {value} = target.dataset
    if(!value) return
    
    const {price, title} = values[value]
    
    modalTitle.innerText = title
    modalPrice.innerText = `${price}$`
    modal.classList.add(classes.opened);
    overlay.classList.add(classes.opened);

}

const closeModal = () => {
    modal.classList.remove(classes.opened)
    overlay.classList.remove(classes.opened)
}


//==//
setText()
startTimer('July 23, 2023 00:00:00')

menuButton.addEventListener('click', toggleMenu)

menuLink.forEach((link) => {
    link.addEventListener('click', scrollToSection)
})

videoButton.addEventListener('click', handleVideo)
checkbox.forEach((box) => {
    box.addEventListener('click', handleCheckbox)
})

initSlider()

faqItem.forEach((item) => {
    item.addEventListener('click', handleFaqItem)
})
window.addEventListener('scroll', handleScroll)

language.forEach((lang) => {
    lang.addEventListener('click', toggleLanguage)
})

buyButton.forEach((btn) => {
    btn.addEventListener('click', handleBuyButton)
})
modalClose.addEventListener('click', closeModal)