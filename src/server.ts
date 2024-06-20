import app from './app'
import { config } from 'dotenv';
import mongoose from 'mongoose'; 

config();


const DB = process.env.W_DATABASE_URL?.replace(
  '<PASSWORD>',
  process.env.W_DATABASE_PASSWORD ?? ""
);

mongoose
  .connect(DB ?? "")
  .then(() => console.log('Database connected'))
  .catch((e) => console.log(e.message));

app.listen(5000,() => {
    console.log("Listening on port 5000");
})
