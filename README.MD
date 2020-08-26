# Parcel Delivery Company - Web App Project

## Link to live page - https://sebastiankut.github.io/Parcel-Delivery-WebApp/

<hr>
To view the functionality of the page you can log in as customer or admin using the following credentials:

CUSTOMER:
username: user1@test.com 
or 
username: user2@test.com
or 
username: user3@test.com
password: test1234

ADMIN: 
username: admin@test.com
password: test1234

You may also sign up creating your own customer account. Sign up process do not require real email address and will not spam your inbox. 

<hr>

This is a project of a demo Web App for a fictional Parcel Delivery Company that specializes in supporting small e-commerce business, offering logistics solutions and and parcel delivery services across European Union, offering next day delivery. 

The project utilises following languages, frameworks and technologies:
- HTML
- CSS
- Vanilla JavaScript
- Materialize
- Firebase (backend)
- Cloud Firestore (database)

IMPORTANT NOTE!

As this is non commercial project based on Firebase Spark (free) plan , it has certain security limitations and solutions that should never be implemented in the real life business web application, namely the use of Cloud Functions and Firebase Admin services or should I say, the lack of it.
In real life scenario, user roles and security related functions should be implemented and stored on a server side, however due to the fact that Firebase functions and Node.js implementation in Firestore requires billing account and is currently (today is 6/08/20) no longer available for free, the solution for Admin and User role and all related logical procedures, have been implemented on a Client side, which for real life business application would be a big compromise in cyber security environment. 
Reading my JS source code and comments hopefully expalins it further.

This web app consist of landing home page as well as user and admin dashboards. It allows users to sign up by creating their own account and then submit orders (add information about the parcels they would like to send). The data they submit is stored in Cloud Firestore - non relational database used by Firebase.
Once logged in customer can view their active (awaiting) and processed (completed) orders, filter them as well as view details for each of their orders. 
After order is submitted by User it can be viewed and processed by Admin (owner of the business). Once order has been processed (parcel has been sent), admin can change order status from "awaiting" to processed by choosing an option from drop-down list, available in orders list under Admin Dashboard. Changing order status allows admin to input tracking number. The changes made by admin are visible to each user under their account dashboard. Admin can also delete orders by ticking the relevant checbox in the list of orders.

Additional functionality under Admin Dashboard:
* Search orders by customers name,
* Filter orders by "All", "Awaiting" or "Processed" orders
* View order details
* Add orders for each client by going to "Add new order" link in the Side Menu and choosing clients name from drop-down list in the add new order form (the client list is dynamically updated from Firestore database).

Last important note - if you wish to delete any of the orders under admin account please make sure you also add some so that there are some orders in the database for other viewers to be able top play with an App.

Thank yopu for taking your time to read this information.
 
 