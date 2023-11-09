module.exports = function (io) {
    const emailToSocketIdMap = new Map(); //which emailid inside each room
    const socketIdToEmailMap = new Map();


    io.on("connection", (socket) => {
        socket.on("room:join", (data) => {
            // console.log(data,'data of ssocket');
            // console.log(socket.id,'sockidd of ssocket');

            const { email, room } = data;
            console.log(email,'email  dddd');
            console.log(room,'room  dddd');

            emailToSocketIdMap.set(email, socket.id);
            socketIdToEmailMap.set(socket.id, email);
        
            io.to(room).emit("user:joined", { email, id: socket.id });
            socket.join(room);
            io.to(socket.id).emit("room:join", data);   //to which user that sent us socket id emit to that user room join,sent o useEffct in front end
          });

          socket.on("user:call", ({ to, offer }) => {
            io.to(to).emit("incoming:call", { from: socket.id, offer });
          });

          socket.on("call:accepted", ({ to, ans }) => {
            io.to(to).emit("call:accepted", { from: socket.id, ans });
          });

          socket.on("peer:nego:needed", ({ to, offer }) => {
            io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
          });
      
          socket.on("peer:nego:done", ({ to, ans }) => {
            io.to(to).emit("peer:nego:final", { from: socket.id, ans });
          });
      


 


    })
}