const connectDatabase = async() => {
    try{
        const conn = await (require("mongoose")).connect(process.env.MONGO_URL)
        console.log(`Mongodb connected with server: ${conn.connection.host}`);
      }
    catch(error){
      console.log(`Error in Mongodb ${error}`);
    }
  };
  
  export default connectDatabase;