module.exports = function (io) {
    const emailToSocketIdMap = new Map(); //which emailid inside each room
    const socketIdToEmailMap = new Map();


    io.on("connection", (socket) => {
        socket.on("room:join", (data) => {
            console.log(data);
            console.log(socket.id);

            const { email, room } = data;
            console.log(email);
            console.log(room);
            emailToSocketIdMap.set(email, socket.id);
            socketIdToEmailMap.set(socket.id, email);
            io.to(room).emit("user:joined", { email, id: socket.id });
            socket.join(room);
            io.to(socket.id).emit("room:join", data);
          });
    })
}