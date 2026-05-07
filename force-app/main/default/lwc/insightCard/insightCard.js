import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import INSIGHT_FIELD from '@salesforce/schema/Movimentacao__c.Insight__c';
import VALOR_FIELD from '@salesforce/schema/Movimentacao__c.Valor__c';
import TIPO_FIELD from '@salesforce/schema/Movimentacao__c.Tipo__c';

const FIELDS = [INSIGHT_FIELD, VALOR_FIELD, TIPO_FIELD];

const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

export default class InsightCard extends LightningElement {
    @api recordId;

    _insightData = null;
    isLoading = true;
    hasError = false;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        this.isLoading = false;
        if (data) {
            const insightRaw = getFieldValue(data, INSIGHT_FIELD);
            this._parseInsight(insightRaw);
        } else if (error) {
            this.hasError = true;
        }
    }

    _parseInsight(raw) {
        if (!raw) {
            this.hasError = true;
            return;
        }
        try {
            this._insightData = JSON.parse(raw);
        } catch (e) {
            this.hasError = true;
        }
    }

    get hasData() {
        return !this.isLoading && !this.hasError && this._insightData !== null;
    }

    get totalReceitas() {
        return formatCurrency(this._insightData?.total_receitas);
    }

    get totalDespesas() {
        return formatCurrency(this._insightData?.total_despesas);
    }

    get saldo() {
        return formatCurrency(this._insightData?.saldo);
    }

    get saldoPositivo() {
        return (this._insightData?.saldo ?? 0) >= 0;
    }

    get saldoStatus() {
        return this.saldoPositivo ? 'Positivo ✅' : 'Negativo ❌';
    }

    get saldoBadgeClass() {
        return this.saldoPositivo ? 'badge badge-positivo' : 'badge badge-negativo';
    }

    get maiorCategoria() {
        const val = this._insightData?.maior_gasto_categoria;
        return (!val || val === 'N/A') ? '—' : val;
    }

    get maiorDepartamento() {
        const val = this._insightData?.maior_gasto_departamento;
        return (!val || val === 'N/A') ? '—' : val;
    }

  get alertas() {
    const lista = this._insightData?.alertas_orcamento ?? [];
    return lista.map(alerta =>
        alerta.replace(/R\$(\d+(?:\.\d+)?)/g, (_, num) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(parseFloat(num));
        })
    );
}

    get hasAlertas() {
        return this.alertas.length > 0;
    }

    get insights() {
    const lista = this._insightData?.insights ?? [];
    return lista.map((texto, idx) => ({
        id: idx,
        texto: this._formatarTextoInsight(texto)
    }));
}

_formatarTextoInsight(texto) {
    return texto
        .replace(/[💰💸📊]/gu, '')
        .replace(/R\$(\d+(?:\.\d+)?)/g, (_, num) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(parseFloat(num));
        })
        .trim();
}

    get _total() {
        const r = this._insightData?.total_receitas ?? 0;
        const d = this._insightData?.total_despesas ?? 0;
        return r + d || 1;
    }

    get receitaBarStyle() {
        const pct = Math.min(100, ((this._insightData?.total_receitas ?? 0) / this._total) * 100);
        return `width: ${pct}%`;
    }

    get despesaBarStyle() {
        const pct = Math.min(100, ((this._insightData?.total_despesas ?? 0) / this._total) * 100);
        return `width: ${pct}%`;
    }
}