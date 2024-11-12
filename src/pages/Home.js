import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import anime from "animejs";
import "./Home.css";

function Home() {
  const [dadosGenero, setDadosGenero] = useState(null);
  const [totalMusicas, setTotalMusicas] = useState(0);
  const [totalGeneros, setTotalGeneros] = useState(0);
  const [totalArtistas, setTotalArtistas] = useState(0);
  const [topAutores, setTopAutores] = useState(null);
  const [tamanhosMedios, setTamanhosMedios] = useState(null);

  const [letra, setLetra] = useState("");
  const [generoPrevisto, setGeneroPrevisto] = useState(null);

  const handleLetraChange = (e) => {
    setLetra(e.target.value);
  };

  const preverGenero = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/prever?letra=${encodeURIComponent(letra)}`
      );
      const data = await response.json();
      setGeneroPrevisto(data.genero);
    } catch (error) {
      console.error("Erro ao prever gênero:", error);
    }
  };

  useEffect(() => {
    // Função para buscar dados de gênero da API
    const buscarDadosGenero = async () => {
      try {
        const response = await fetch("http://localhost:8000/contar_generos/");
        const data = await response.json();
        const dados = data.contagem_de_generos;

        const generos = Object.keys(dados);
        const quantidades = Object.values(dados);

        setDadosGenero({ generos, quantidades });
        setTotalGeneros(generos.length);
        setTotalMusicas(quantidades.reduce((acc, cur) => acc + cur, 0));
      } catch (error) {
        console.error("Erro ao buscar dados de gêneros:", error);
      }
    };

    // Função para buscar os 5 autores com mais músicas da API
    const fetchTopAutores = async () => {
      try {
        const response = await fetch("http://localhost:8000/top5_autores/");
        const data = await response.json();
        const dados = data.top5_autores;

        const autores = Object.keys(dados);
        const quantidades = Object.values(dados);

        setTopAutores({ autores, quantidades });
      } catch (error) {
        console.error("Erro ao buscar dados dos top autores:", error);
      }
    };

    // Função para buscar total de autores da API
    const buscarTotalAutores = async () => {
      try {
        const response = await fetch("http://localhost:8000/listar_autores/");
        const data = await response.json();
        const qtd = data.autores.length;

        setTotalArtistas(qtd);
      } catch (error) {
        console.error("Erro ao buscar dados de gêneros:", error);
      }
    };

    // Função para obter o tamanho médio das letras
    const fetchTamanhoMedioLetrasPorGenero = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/tamanho_medio_letras_por_genero/"
        );
        const data = await response.json();
        const dados = data.tamanho_medio_letras_por_genero;

        const generos = Object.keys(dados);
        const tamanhosMedios = Object.values(dados);

        setTamanhosMedios({ generos, tamanhosMedios });
      } catch (error) {
        console.error(
          "Erro ao buscar dados de tamanho médio das letras:",
          error
        );
      }
    };

    buscarDadosGenero();
    fetchTopAutores();
    buscarTotalAutores();
    fetchTamanhoMedioLetrasPorGenero();

    // Animações
    anime({
      targets: ".stat-card",
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeOutElastic(1, .5)",
    });

    anime({
      targets: ".card",
      scale: [0.95, 1],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeOutElastic(1, .5)",
    });
  }, []);

  useEffect(() => {
    if (dadosGenero) {
      new Chart(document.getElementById("genreChart"), {
        type: "doughnut",
        data: {
          labels: dadosGenero.generos,
          datasets: [
            {
              data: dadosGenero.quantidades,
              backgroundColor: [
                "#6C63FF",
                "#FF6584",
                "#2F2E41",
                "#F50057",
                "#FFC107",
                "#00BFA6",
                "#FFAA00",
                "#8C9EFF",
                "#D500F9",
                "#00C853",
                "#FF4081",
                "#64DD17",
              ],
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  }, [dadosGenero]);

  useEffect(() => {
    if (topAutores) {
      new Chart(document.getElementById("artistChart"), {
        type: "bar",
        data: {
          labels: topAutores.autores,
          datasets: [
            {
              label: "Número de Músicas",
              data: topAutores.quantidades,
              backgroundColor: "#6C63FF",
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [topAutores]);

  useEffect(() => {
    if (tamanhosMedios) {
      new Chart(document.getElementById("graficoTamanhoLetra"), {
        type: "line",
        data: {
          labels: tamanhosMedios.generos,
          datasets: [
            {
              label: "Tamanho Médio de Letras",
              data: tamanhosMedios.tamanhosMedios,
              borderColor: "#6C63FF",
              tension: 0.4,
              fill: true,
              backgroundColor: "rgba(108, 99, 255, 0.1)",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
        },
      });
    }
  }, [tamanhosMedios]);

  return (
    <div>
      <div className="header">
        <h1>Dashboard Música</h1>
        <p>Veja algumas estatísticas curiosas sobre os gêneros musicais</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalMusicas}</h3>
          <p>Total de Músicas</p>
        </div>
        <div className="stat-card">
          <h3>{totalArtistas}</h3>
          <p>Total de Artistas</p>
        </div>
        <div className="stat-card">
          <h3>{totalGeneros}</h3>
          <p>Total de Gêneros</p>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <h2>Top Artistas com Músicas</h2>
          <canvas id="artistChart"></canvas>
        </div>
        <div className="card">
          <h2>Distribuição de Gêneros</h2>
          <canvas id="genreChart"></canvas>
        </div>
        <div className="card">
          <h2>Tamanho Médio da Letra</h2>
          <canvas id="graficoTamanhoLetra"></canvas>
        </div>
      </div>
      <div className="card">
        <h2>Prever Gênero da Música</h2>
        <textarea
          placeholder="Digite a letra da música aqui..."
          value={letra}
          onChange={handleLetraChange}
          rows="6"
        />
        <button onClick={preverGenero} className="btn-prever">
          Prever Gênero
        </button>

        {generoPrevisto && (
          <div className="resultado-previsao">
            <p>
              <strong>Gênero Previsto:</strong> {generoPrevisto}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
