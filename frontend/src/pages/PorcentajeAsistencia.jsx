import { useState } from "react";
import useCalcularPorcentajeAsistencia from "@hooks/asistencias/useCalcularPorcentajeAsistencia";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import "@styles/calcularAsistencia.css";

const PorcentajeAsistencia = () => {
    const [profesorId, setProfesorId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { porcentaje, loading, error, calcular } = useCalcularPorcentajeAsistencia();

    const handleCalcular = async () => {
        if (!profesorId || !startDate || !endDate) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        await calcular({ profesorId, startDate, endDate });
    };

    const data = porcentaje
        ? [
            { name: "Clases Asistidas", value: parseFloat(porcentaje) },
            { name: "Clases Faltadas", value: 100 - parseFloat(porcentaje) },
        ]
        : [];

    const COLORS = ["#00C49F", "#FF8042"];

    return (
        <div className="calcular-asistencia-container">
            <h1>Calcular Porcentaje de Asistencia</h1>
            <div className="calcular-asistencia-form">
                <label>
                    Profesor ID:
                    <input
                        type="text"
                        placeholder="Ingrese el ID del profesor"
                        value={profesorId}
                        onChange={(e) => setProfesorId(e.target.value)}
                    />
                </label>
                <label>
                    Fecha Inicio:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label>
                    Fecha Fin:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
                <button onClick={handleCalcular} disabled={loading} className="calcular-button">
                    {loading ? "Calculando..." : "Calcular"}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {porcentaje !== null && (
                <div className="resultado-container">
                    <h2>Resultado</h2>
                    <p>Porcentaje de Asistencia: {porcentaje}%</p>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default PorcentajeAsistencia;
