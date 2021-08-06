//STATES THAT YOU MAY WANT TO HAVE:
//set state to get the grand total of all subtotals
const [total, setTotal] = useState(0)
//set state for cart
const [cart, setCart] = useState([])
//states to determine the current product the user can add to their cart
const [id, setId] = useState("")
const [name, setName] = useState("")
const [description, setDescription] = useState("")
const [qty, setQty] = useState(1)
const [price, setPrice] = useState(0)

//FOR GETTING YOUR LOCALSTORAGE CART ITEMS AND SETTING YOUR CART STATE:
//on component mount, check if there is an existing cart in localStorage. If there is, set its contents as our cart state
useEffect(()=> {
	if(localStorage.getItem('cart')){
		setCart(JSON.parse(localStorage.getItem('cart')))
	}
}, [])

//FOR UPDATING A STATE THAT DETERMINES THE TOTAL AMOUNT:
//whenever our cart state changes, re-calculate the total
useEffect(()=> {
	//start with a counter initialized to zero
	let tempTotal = 0

	//loop through our cart, getting each item's subtotal and incrementing our tempTotal counter by its amount
	cart.forEach((item)=> {
		tempTotal += item.subtotal
	})

	//set our total state
	setTotal(tempTotal)
}, [cart])


//FOR ADDING ITEMS TO CART:
const addToCart = () => {
	//variable to determine if the item we are adding is already in our cart or not
	let alreadyInCart = false
	//variable for the item's index in the cart array, if it already exists there
	let productIndex
	//temporary cart array
	let cart = []

	if(localStorage.getItem('cart')){
		cart = JSON.parse(localStorage.getItem('cart'))
	}

	//loop through our cart to check if the item we are adding is already in our cart or not
	for(let i = 0; i < cart.length; i++){
		if(cart[i].productId === id){
			//if it is, make alreadyInCart true
			alreadyInCart = true
			productIndex = i
		}
	}

	//if a product is already in our cart, just increment its quantity and adjust its subtotal
	if(alreadyInCart){
		cart[productIndex].quantity += qty
		cart[productIndex].subtotal = cart[productIndex].price * cart[productIndex].quantity
	}else{
		//else add a new entry in our cart, with values from states that need to be set wherever this function goes
		cart.push({
			'productId' : id,
			'name': name,
			'price': price,
			'quantity': qty,
			'subtotal': price * qty
		})		
	}

	//set our localStorage cart as well
	localStorage.setItem('cart', JSON.stringify(cart))
}

//FOR ADJUSTING THE QUANTITY OF AN ITEM BASED ON INPUT:
const qtyInput = (productId, value) => {

	//use the spread operator to create a temporary copy of our cart (from the cart state)
	let tempCart = [...cart]

	//loop through our tempCart 
	for(let i = 0; i < tempCart.length; i++){
		//so that we can find the item with the quantity we want to change via its productId
		if(tempCart[i].productId === productId){
			//use parseFloat to make sure our new quantity will be parsed as a number
			tempCart[i].quantity = parseFloat(value)
			//set the new subtotal
			tempCart[i].subtotal = tempCart[i].price * tempCart[i].quantity
		}
	}

	//set our cart state with the new quantities
	setCart(tempCart)

	//set our localStorage cart as well
	localStorage.setItem('cart', JSON.stringify(tempCart))	
}

//FOR REMOVING AN ITEM FROM CART:
const removeItem = (productId) => {
	//use the spread operator to create a temporary copy of our cart (from the cart state)
	let tempCart = [...cart]

	//use splice to remove the item we want from our cart
	tempCart.splice([tempCart.indexOf(productId)], 1)

	//set our cart state with the new quantities
	setCart(tempCart)

	//set our localStorage cart as well
	localStorage.setItem('cart', JSON.stringify(tempCart))	
}