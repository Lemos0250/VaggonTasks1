import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [atividades, setAtividades] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    status: "pendente",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:3001/atividades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      ...formData,
      descrição: formData.descricao,
    }),
    });

    if (response.ok) {
      toast.success("Atividade adicionada com sucesso!");
      setFormData({
        nome: "",
        descricao: "",
        data_inicio: "",
        data_fim: "",
        status: "pendente",
      });
      fetchAtividades(); 
    } else {
      toast.error("Erro ao adicionar atividade!");
    }
  };

  const fetchAtividades = async () => {
    const response = await fetch("http://localhost:3001/atividades");
    const data = await response.json();
    setAtividades(data);
  };

  useEffect(() => {
    fetchAtividades();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/atividades/${id}`, { method: "DELETE" });
    toast.info("Atividade removida!");
    fetchAtividades();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ backgroundImage: "url('/Bolasfundo.jpg')" }}>
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">Agenda de Atividades</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome da Atividade</label>
            <input type="text" id="nome" name="nome" className="w-full mt-1 p-4 border rounded-xl" 
              placeholder="Digite o nome da atividade" value={formData.nome} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="data_inicio" className="text-sm font-medium text-gray-700">Data e Hora de Início</label>
              <input type="datetime-local" id="data_inicio" name="data_inicio" className="w-full mt-1 p-4 border rounded-xl" 
                value={formData.data_inicio} onChange={handleChange} />
            </div>

            <div className="flex flex-col">
              <label htmlFor="data_fim" className="text-sm font-medium text-gray-700">Data e Hora de Término</label>
              <input type="datetime-local" id="data_fim" name="data_fim" className="w-full mt-1 p-4 border rounded-xl" 
                value={formData.data_fim} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="descricao" className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea id="descricao" name="descricao" rows="4" className="w-full mt-1 p-4 border rounded-md" 
              placeholder="Descreva a atividade" value={formData.descricao} onChange={handleChange}></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
            <select id="status" name="status" className="w-full mt-1 p-4 border rounded-md" 
              value={formData.status} onChange={handleChange}>
              <option value="pendente">Pendente</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md">Adicionar Atividade</button>
          </div>
        </form>
      </div>

      <div className="w-full justify-center flex max-w-4xl bg-white p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 justify-center mb-4">Atividades Cadastradas</h2>
        <ul>
          {atividades.map((atividade) => (
            <li key={atividade.id} className="flex justify-between items-center border-b py-2">
              <div>
                <h3 className="text-lg font-semibold">{atividade.nome}</h3>
                <p className="text-sm text-gray-600">{atividade.descricao}</p>
                <p className="text-sm">Início: {new Date(atividade.dataInicio).toLocaleString()}</p>
                <p className="text-sm">Término: {new Date(atividade.dataFim).toLocaleString()}</p>
                <p className={`text-sm font-bold ${atividade.status === "pendente" ? "text-yellow-500" : atividade.status === "concluida" ? "text-green-500" : "text-red-500"}`}>
                  {atividade.status}
                </p>
              </div>
              <button onClick={() => handleDelete(atividade.id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Excluir !</button>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Register;
