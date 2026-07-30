# Eporifrutas Ops Hub

Protótipo demonstrativo de uma **camada operacional pré-PHC** para a Eporifrutas (distribuição hortofrutícola). O PHC continua a ser o sistema de registo; esta app **captura, valida, reconcilia e analisa** — com o humano no controlo — antes de os dados entrarem no PHC.

> ⚠️ **Demonstração** — dados fictícios, login e integrações simulados. Serve para apresentação e validação do conceito.

## Módulos

- **Dashboard** — visão executiva com alertas de cobrança automáticos.
- **Receção de Encomendas** — várias IAs leem a encomenda em qualquer formato (email, PDF, Excel, foto, WhatsApp), interpretam e traduzem para a linguagem do PHC (códigos + Kg), prontas a enviar por API.
- **Receção vs. Faturação** — conferência da mercadoria recebida (Kg) vs. faturada e pedidos de creditação a fornecedores.
- **Conta-corrente & Cobranças** — lê faturas e recibos do PHC (recibo liquida a fatura → cliente regulariza-se automaticamente), prazo de pagamento por cliente, alertas e email de cobrança com modelo editável.
- **Análise de Tendências** — séries de 12 meses, mix por categoria/canal, top artigos.
- **Clientes** e **Artigos** (catálogo + conversor para Kg).
- **Procedimentos & Assistente** — base de conhecimento partilhada + assistente interno que responde a dúvidas com base nos procedimentos.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · lucide-react

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3008
```

## Contas demo

| Papel | Email | Password |
|-------|-------|----------|
| Administração | direcao@eporifrutas.pt | `epori` |
| Comercial | comercial@eporifrutas.pt | `epori` |
| Operações | armazem@eporifrutas.pt | `epori` |
| Financeiro | financeiro@eporifrutas.pt | `epori` |

## Deploy

Aplicação Next.js standard, **sem variáveis de ambiente** necessárias. Pronta para deploy na Vercel (deteção automática do framework).
