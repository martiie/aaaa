import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db, serverTimestamp } from '../firebase'; // นำเข้า serverTimestamp อย่างถูกต้อง

function Todo() {
    const [todo, setTodo] = useState("");  // เก็บค่าจาก input
    const [todos, setTodos] = useState([]); // เก็บรายการ todo ทั้งหมด
    const [lastVisible, setLastVisible] = useState(null); // เก็บ document สุดท้ายที่ดึงจาก Firestore
    const [hasMore, setHasMore] = useState(true); // สถานะว่ามีหน้าถัดไปหรือไม่
    const pageSize = 5; // จำนวนรายการต่อหน้า

    // ฟังก์ชันเพิ่ม todo ใหม่
    const addTodo = async (e) => {
        e.preventDefault();
        if (todo.trim() === "") {
            console.error("Todo cannot be empty!");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "todos"), {
                todo: todo,
                timestamp: serverTimestamp() // เพิ่ม timestamp
            });
            console.log("Document written with ID: ", docRef.id);
            setTodo(""); // เคลียร์ค่า input หลังการ submit
            fetchFirstPage(); // อัปเดตรายการ todo ใหม่หลังการเพิ่ม
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    // ฟังก์ชันดึงข้อมูลหน้าแรก
    const fetchFirstPage = async () => {
        const q = query(collection(db, "todos"), orderBy("timestamp", "desc"), limit(pageSize));
        const querySnapshot = await getDocs(q);
        
        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setTodos(newData);  // ตั้งค่า todos เป็นรายการใหม่
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // เก็บ document สุดท้าย

        setHasMore(querySnapshot.docs.length === pageSize); // ตรวจสอบว่ามีหน้าถัดไปหรือไม่
    };

    // ฟังก์ชันดึงข้อมูลหน้าถัดไป
    const fetchNextPage = async () => {
        if (!lastVisible) return;

        const q = query(
            collection(db, "todos"),
            orderBy("timestamp", "desc"),
            startAfter(lastVisible), // เริ่มดึงข้อมูลหลังจาก document สุดท้ายของหน้าแรก
            limit(pageSize)
        );
        const querySnapshot = await getDocs(q);

        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setTodos((prevTodos) => [...prevTodos, ...newData]); // เพิ่มข้อมูลใหม่ในรายการเดิม
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // อัปเดต document สุดท้าย

        setHasMore(querySnapshot.docs.length === pageSize); // ตรวจสอบว่ามีหน้าถัดไปหรือไม่
    };

    useEffect(() => {
        fetchFirstPage();
    }, []);

    return (
        <div>
            <h1>Todo List with Pagination</h1>
            <div>
                <input 
                    type="text" 
                    placeholder="What do you want?" 
                    value={todo}  // เชื่อมต่อค่า input กับ state
                    onChange={(e) => setTodo(e.target.value)} 
                />
                <button type="submit" onClick={addTodo}>Submit</button>
            </div>

            {/* แสดงรายการ todo ในรูปแบบตาราง */}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Todo</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.length > 0 ? (
                        todos.map((todo, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{todo.todo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No todos yet!</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* แสดงปุ่ม "โหลดเพิ่มเติม" เมื่อมีหน้าถัดไป */}
            {hasMore && (
                <button onClick={fetchNextPage}>
                    Load More
                </button>
            )}
        </div>
    );
}

export default Todo;
