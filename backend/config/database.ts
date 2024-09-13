const connectDatabase = async() => {
    try{
        const conn = await (require("mongoose")).connect('mongodb+srv://gazitahsin323:tah12345@cluster0.x4q0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log(`Mongodb connected with server: ${conn.connection.host}`);
      }
    catch(error){
      console.log(`Error in Mongodb ${error}`);
    }
  };
  
  export default connectDatabase;