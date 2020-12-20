// importing
const express = require("express")
const mongoose = require("mongoose")
const Pusher = require("pusher")
const request = require("request")


const productSchema = mongoose.Schema({
    name: {type: String, unique: true},
    description: String,
    code: String,
    attributes: [
        {
            isRequired: Boolean,
            entity: String,
            key: String
        }
    ],
    price: Number
})

const Products = mongoose.model('products', productSchema)

// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1124206",
    key: "0ef9f124576ed1c33505",
    secret: "1cb8670f3cff5390a18c",
    cluster: "ap3",
    useTLS: true
});

const db = mongoose.connection

db.once('open', () => {

    console.log("DB is connected")

    const productsCollection = db.collection("products")
    const changeStream = productsCollection.watch()

    changeStream.on("change", (change) => {

        console.log(change.operationType)

        if (change.operationType === "insert") {

            console.log("data inserted")

            const insertedProduct = change.fullDocument

            console.log(insertedProduct)

            pusher.trigger("products", "inserted", insertedProduct).then(r => {

            }).catch(err => {
                console.log(err)
            })

        }

        if (change.operationType === "delete") {

            console.log("data deleted")
            console.log(change)

            const deletedProductID = change.documentKey._id

            console.log(deletedProductID)

            pusher.trigger("products", "delete", deletedProductID).then(r => {

            }).catch(err => {
                console.log(err)
            })

        }

        if (change.operationType === "replace") {

            console.log("data replaced")

            const replacedDocument = change.fullDocument

            console.log(replacedDocument)

            pusher.trigger("products", "replace", replacedDocument).then(r => {

            }).catch(err => {
                console.log(err)
            })

        }

    })

})

// middleware
app.use(express.json())

// maybe npm i cors
// app.use(cors())
app.use((req, res, next) => {
    const getOrigin = () => {
        const origin = req.get("origin")
        if (origin === "http://localhost:3000" || origin === "http://192.168.0.10:3000") {
            return origin
        } else return false

    }
    res.set({
        "Access-Control-Allow-Origin": getOrigin(),
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, X-Requested-With"
    })
    next()
})

// DB config
const connectionURL = "mongodb+srv://admin:mgFgnVcdku1yk2o4@cluster0.usz2p.mongodb.net/mern-test-backend?retryWrites=true&w=majority"

mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// api routes

app.get('/getInitialData', function (req, res) {

    console.log("get initial data")
    Products.find({}, (err, snap) => {

        const product = []

        if (snap.length === 0) {
            console.log("finished loading initial data")
            res.status(200).send(product)
        } else {

            snap.forEach((item, ind) => {

                product.push(item)

                if (snap.length === ind + 1) {

                    console.log("finished loading initial data")
                    product.sort((a, b) => (a._id < b._id) ? 1 : -1)
                    res.status(200).send(product)

                }

            })
        }


    });

});

app.post("/products/new", (req, res) => {

    const dbProduct = req.body

    console.log("creating new product....")

    Products.create(dbProduct, (err, data) => {

        if (err) {
            console.log("Error")
            console.log(err.message)
            res.status(500).send(err)
        } else {
            console.log("New product created")
            console.log(data)
            res.status(200).send(data)
        }

    })

})

app.post("/products/fetchAll", (req, res) => {

    console.log("started fetching")

    const fetchedProducts = []

    const options = {
        method: 'get',
        url: `https://hei.dev.internal.buddybid.com/api/products`,
        headers: {
            'apikey': 'bc9dd843dddda2a29682da9d10bc6737'
        }
    };

    const loadMoreProducts = () => {

        const pageID = fetchedProducts.length / 10 + 1

        const loadMoreOptions = {
            method: 'get',
            url: `https://hei.dev.internal.buddybid.com/api/products?page=${pageID}`,
            headers: {
                'apikey': 'bc9dd843dddda2a29682da9d10bc6737'
            }
        };

        request(loadMoreOptions, callback)

    }

    const putFetchedDataInDatabase = () => {

        Products.create(fetchedProducts).then(r => {

            const result = {
                products: r,
                count: fetchedProducts.length
            }

            res.status(200).send(result)

        }).catch(err => {

            console.log(err.message)
            res.status(500).send(err)

        })

    }

    const callback = (err, response, body) => {

        if (err) {

            res.status(500).send(err)

        } else if (response.statusCode === 200) {

            const data = JSON.parse(body);

            if (data.products && data.count) {

                if (parseInt(data.count) !== fetchedProducts.length) {

                    data.products.forEach(product => {

                        console.log(product)

                        fetchedProducts.push(product)

                    })

                    loadMoreProducts()

                } else {

                    console.log("finish fetching")
                    putFetchedDataInDatabase()

                }
            }

        }

    }

    request(options, callback);

})

app.post("/products/update", (req, res) => {

    const dbProduct = req.body
    const _id = dbProduct._id

    console.log("updating product #" + _id)

    Products.replaceOne({_id}, dbProduct, [], (err, snap) => {

        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(snap)
        }

    })

})

app.post("/products/delete", (req, res) => {

    const dbProduct = req.body
    const _id = dbProduct._id

    console.log("deleting product #" + _id)

    Products.deleteOne({_id}, [], (err, snap) => {

        if (err) {
            console.log("Error")
            console.log(err.message)
            res.status(500).send(err)
        } else {
            console.log("Deleted product")
            console.log(dbProduct)
            res.status(200).send(dbProduct)
        }

    })

})

//listener
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`)
})