import { LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CHARTJS from '@salesforce/resourceUrl/chartjs';
import getResumoFinanceiro from '@salesforce/apex/PainelFinanceiroController.getResumoFinanceiro';

const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const COLORS_RECEITA = '#10b981';
const COLORS_DESPESA = '#f43f5e';
const COLORS_BARS = [
    '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e',
    '#8b5cf6', '#06b6d4', '#84cc16'
];

export default class PainelFinanceiro extends LightningElement {

    isLoading = true;
    _chartJsLoaded = false;
    _dados = null;

    _donutInstance = null;
    _barInstance = null;
    _categoriaInstance = null;

    @wire(getResumoFinanceiro)
    wiredDados({ error, data }) {
        if (data) {
            this._dados = JSON.parse(data);
            this._tentarRenderizarGraficos();
        } else if (error) {
            console.error('Erro ao buscar dados:', error);
            this.isLoading = false;
        }
    }

    connectedCallback() {
        loadScript(this, CHARTJS)
            .then(() => {
                this._chartJsLoaded = true;
                this._tentarRenderizarGraficos();
            })
            .catch(error => console.error('Erro ao carregar Chart.js:', error));
    }

    _tentarRenderizarGraficos() {
        if (!this._chartJsLoaded || !this._dados) return;
        this.isLoading = false;

        // Aguarda o DOM atualizar antes de renderizar
        setTimeout(() => {
            this._renderizarDonut();
            this._renderizarBarDepartamento();
            this._renderizarBarCategoria();
        }, 100);
    }

    _renderizarDonut() {
        const canvas = this.refs.donutChart;
        if (!canvas) return;
        if (this._donutInstance) this._donutInstance.destroy();

        this._donutInstance = new window.Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['Receitas', 'Despesas'],
                datasets: [{
                    data: [
                        this._dados.total_receitas,
                        this._dados.total_despesas
                    ],
                    backgroundColor: [COLORS_RECEITA, COLORS_DESPESA],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            font: { size: 12, family: 'Segoe UI' },
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ' ' + formatCurrency(ctx.raw)
                        }
                    }
                }
            }
        });
    }

    _renderizarBarDepartamento() {
        const canvas = this.refs.barChart;
        if (!canvas) return;
        if (this._barInstance) this._barInstance.destroy();

        const labels = this._dados.gastos_por_departamento.map(d => d.nome);
        const valores = this._dados.gastos_por_departamento.map(d => d.total);

        this._barInstance = new window.Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Despesas',
                    data: valores,
                    backgroundColor: COLORS_BARS.slice(0, labels.length),
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ' ' + formatCurrency(ctx.raw)
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: {
                            callback: (val) => 'R$ ' + (val / 1000000).toFixed(1) + 'M',
                            font: { size: 11 }
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 12 } }
                    }
                }
            }
        });
    }

    _renderizarBarCategoria() {
        const canvas = this.refs.categoriaChart;
        if (!canvas) return;
        if (this._categoriaInstance) this._categoriaInstance.destroy();

        const labels = this._dados.gastos_por_categoria.map(d => d.nome);
        const valores = this._dados.gastos_por_categoria.map(d => d.total);

        this._categoriaInstance = new window.Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Gastos',
                    data: valores,
                    backgroundColor: COLORS_BARS.slice(0, labels.length),
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ' ' + formatCurrency(ctx.raw)
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 12 } }
                    },
                    y: {
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: {
                            callback: (val) => 'R$ ' + (val / 1000000).toFixed(1) + 'M',
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    get totalReceitas() {
        return formatCurrency(this._dados?.total_receitas);
    }

    get totalDespesas() {
        return formatCurrency(this._dados?.total_despesas);
    }

    get saldoGeral() {
        return formatCurrency(this._dados?.saldo);
    }

    get saldoPositivo() {
        return (this._dados?.saldo ?? 0) >= 0;
    }

    get saldoStatus() {
        return this.saldoPositivo ? 'Positivo ✅' : 'Negativo ❌';
    }

    get saldoBadgeClass() {
        return this.saldoPositivo ? 'badge badge-positivo' : 'badge badge-negativo';
    }

    get totalMovimentacoes() {
        return this._dados?.total_movimentacoes ?? 0;
    }

    get totalDepartamentos() {
        return this._dados?.gastos_por_departamento?.length ?? 0;
    }

    get totalCategorias() {
        return this._dados?.gastos_por_categoria?.length ?? 0;
    }
}