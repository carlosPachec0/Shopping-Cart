const cards          = document.getElementById('cards')
const items          = document.getElementById('items')
const headboard         = document.getElementById('headboard')
const templateCard   = document.getElementById('template-card').content
const templateheadboard = document.getElementById('template-headboard').content
const templateCart   = document.getElementById('template-cart').content
const fragment = document.createDocumentFragment()
let cart = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    //with lolcalstorage dont matters if relogs website bc it saves items 
    if (localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
        pintarCart()
    }
})
//to add cards to our cart
cards.addEventListener('click', e => {
    addCart(e)
})

items.addEventListener('click', e => {
    btnAction(e)
})

const fetchData = async () => {
    try {
        const res  = await fetch('api.json')
        const data = await res.json()
        
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
    //console.log(data)
    data.forEach(product => {
        //those templates are used to show up the content of products (img, title, prices)
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent  = product.price
        templateCard.querySelector('img').setAttribute("src", product.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = product.id

        ///////////////////////////////
        //it make a clonation
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCart = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))

    if(e.target.classList.contains('btn-dark')) {

        setCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCart = object => {
    
    const product = {
        id: object.querySelector('.btn-dark').dataset.id,
        title: object.querySelector('h5').textContent,
        price: object.querySelector('p').textContent,
        amount: 1
    }
    //the cart save all products that we are buy
    if(cart.hasOwnProperty(product.id)) {
        product.amount = cart[product.id].amount + 1
    }
    //to push element inside the cart
    cart[product.id] = {...product}
    pintarCart()
}

const pintarCart = () => {
    //console.log(cart)
    items.innerHTML = ''
    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id
        templateCart.querySelectorAll('td')[0].textContent = product.title
        templateCart.querySelectorAll('td')[1].textContent = product.amount
        templateCart.querySelector('.btn-info').dataset.id = product.id
        templateCart.querySelector('.btn-danger').dataset.id = product.id
        templateCart.querySelector('span').textContent = product.amount * product.price
        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarheadboard()
    //with lolcalstorage dont matters if relogs website bc it saves items 
    localStorage.setItem('cart', JSON.stringify(cart))
}

const pintarheadboard = () => {
    headboard.innerHTML = ''
    if(Object.keys(cart).length === 0) {
        headboard.innerHTML = `
        <th scope="row" colspan="5">Empty cart - Start to buy!</th>
        `
        return
    }
    const nAmount = Object.values(cart).reduce((acc, { amount}) => acc + amount, 0)
    const nPrice  = Object.values(cart).reduce((acc, {amount, price}) => acc + amount * price, 0)

    templateheadboard.querySelectorAll('td')[0].textContent = nAmount
    templateheadboard.querySelector('span').textContent     = nPrice

    const clone = templateheadboard.cloneNode(true)
    fragment.appendChild(clone)
    headboard.appendChild(fragment)

    const btnEmpty = document.getElementById('empty-cart')
    btnEmpty.addEventListener('click', () => {
        cart = {}
        //to paint again the cart
        pintarCart()
    })
}

const btnAction = e => {
    console.log(e.target)
    //action to increasing
    if(e.target.classList.contains('btn-info')) {
        console.log(cart[e.target.dataset.id]) 

        const product = cart[e.target.dataset.id]
        product.amount++
        cart[e.target.dataset.id] = {...product}
        pintarCart()
    }
    if(e.target.classList.contains('btn-danger')) {
        const product = cart[e.target.dataset.id]
        product.amount--
        if (product.amount === 0) {
            delete cart[e.target.dataset.id]
        }
        pintarCart()
    }
    e.stopPropagation()
}