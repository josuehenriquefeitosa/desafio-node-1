import { v4 as uuidv4} from 'uuid';
import cors from 'cors'
import express, { json, request, response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT
const orders = []

const checkOrderById = (request, response, next) =>{
	const {id} = request.params

	const index = orders.findIndex( order => order.id === id)
	if( index < 0){
		return response.status(404).json({message: "Order not found"})
	}

	request.orderIndex = index
	next()
}

const showRequestInfos = (request,response,next)=>{
	const { method , url} = request
	console.log(`[${method}] - ${url}`)

	next()
}

//Rota que lista todos os pedidos já feitos.
app.get('/order', showRequestInfos, (request, response)=>{

	return response.status(200).json(orders)
})

// Essa rota recebe o id nos parâmetros e deve retornar um pedido específico.
app.get('/order/:id',showRequestInfos,checkOrderById, (request, response)=>{
	const index = request.orderIndex

	const orderById = orders[index]

	return response.status(200).json(orderById)
})


// A rota deve receber o pedido do cliente, o nome do cliente e o valor do pedido
app.post('/order',showRequestInfos, (request,response)=>{
	const { order, clientName, price, status} = request.body
	const newOrder = {id:uuidv4(),order,clientName,price, status}

	orders.push(newOrder)
	return response.status(201).json(newOrder)

})


//Essa rota deve alterar um pedido já feito. Pode alterar,um ou todos os dados do pedido.
app.put('/order/:id',showRequestInfos,checkOrderById, (request,response)=>{
	const index = request.orderIndex
	const { order, clientName, price, status} = request.body

	const updateOrder = {id, order, clientName, price, status}

	orders[index] = updateOrder

	return response.status(200).json(updateOrder)
	
})


//Essa rota deve deletar um pedido já feito com o id enviado nos parâmetros da rota
app.delete('/order/:id',showRequestInfos,checkOrderById, (request, response)=>{
	const index = request.orderIndex
	
	orders.splice(index,1)

	return response.status(204).json()
})


app.patch('/order/:id',showRequestInfos,checkOrderById, (request, response)=>{
	const index = request.orderIndex
	const {status} = request.body
	const statusUpdate = {status}

	if(index < 0){
		return response.status(404).json({message: "Update was not possible,Order not found"})
	}

	 orders[index].status = statusUpdate

	return response.status(200).json()
})



app.listen(port, ()=>{
	console.log(`🔥🚀 Server started on port ${port} 🚀🔥`)
})