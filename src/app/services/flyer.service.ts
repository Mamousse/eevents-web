import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class FlyerService {

  constructor() { }

  // Générer un flyer HTML pour l'événement
  generateFlyerHTML(event: Event): string {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Générer le HTML du flyer
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .flyer {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            width: 600px;
            max-width: 100%;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .content {
            padding: 40px;
          }
          .info-row {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
          }
          .info-row .icon {
            font-size: 24px;
            margin-right: 15px;
            color: #667eea;
          }
          .info-row .text {
            flex: 1;
          }
          .info-row .label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          .info-row .value {
            font-size: 18px;
            color: #212529;
            font-weight: 600;
          }
          .description {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .description h3 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 18px;
          }
          .description p {
            color: #495057;
            line-height: 1.6;
          }
          .tickets {
            margin-bottom: 20px;
          }
          .tickets h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .ticket-type {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ticket-type .name {
            font-weight: 600;
            color: #212529;
          }
          .ticket-type .price {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
          }
          .qr-section {
            text-align: center;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
          }
          .qr-section h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .qr-section img {
            width: 200px;
            height: 200px;
            margin: 0 auto;
          }
          .qr-section p {
            margin-top: 15px;
            color: #6c757d;
            font-size: 14px;
          }
          .footer {
            background: #212529;
            color: white;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="flyer">
          <div class="header">
            <h1>${event.nom}</h1>
          </div>

          <div class="content">
            <div class="info-row">
              <div class="icon">📅</div>
              <div class="text">
                <div class="label">Date</div>
                <div class="value">${formattedDate}</div>
              </div>
            </div>

            <div class="info-row">
              <div class="icon">🕐</div>
              <div class="text">
                <div class="label">Heure</div>
                <div class="value">${formattedTime}</div>
              </div>
            </div>

            <div class="info-row">
              <div class="icon">📍</div>
              <div class="text">
                <div class="label">Lieu</div>
                <div class="value">${event.emplacement}</div>
              </div>
            </div>

            <div class="info-row">
              <div class="icon">🎫</div>
              <div class="text">
                <div class="label">Places disponibles</div>
                <div class="value">${event.nombrePlacesDisponibles} places</div>
              </div>
            </div>

            ${event.description ? `
            <div class="description">
              <h3>Description</h3>
              <p>${event.description}</p>
            </div>
            ` : ''}

            <div class="tickets">
              <h3>Types de billets</h3>
              ${event.modalitesEntree.map(modalite => `
                <div class="ticket-type">
                  <div class="name">${modalite.type}</div>
                  <div class="price">${modalite.prix > 0 ? modalite.prix + ' FCFA' : 'Gratuit'}</div>
                </div>
              `).join('')}
            </div>

            ${event.qrCodeUrl ? `
            <div class="qr-section">
              <h3>Scannez pour réserver</h3>
              <img src="${event.qrCodeUrl}" alt="QR Code">
              <p>Scannez ce code QR pour réserver vos places</p>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>Réservez maintenant sur ${event.lienReservation || 'notre plateforme'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  // Générer un flyer et le télécharger
  async downloadFlyer(event: Event): Promise<void> {
    const html = this.generateFlyerHTML(event);
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flyer-${event.nom.replace(/\s+/g, '-').toLowerCase()}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Partager via WhatsApp
  shareOnWhatsApp(event: Event): void {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Construire le message WhatsApp
    const message = `
🎉 *${event.nom}* 🎉

📅 Date: ${formattedDate}
🕐 Heure: ${formattedTime}
📍 Lieu: ${event.emplacement}
🎫 Places disponibles: ${event.nombrePlacesDisponibles}

${event.description ? `📝 Description:\n${event.description}\n\n` : ''}

💰 *Types de billets:*
${event.modalitesEntree.map(m => `• ${m.type}: ${m.prix > 0 ? m.prix + ' FCFA' : 'Gratuit'}`).join('\n')}

🔗 Réservez maintenant: ${event.lienReservation || window.location.origin + '/reservation/' + event.id}

${event.qrCodeUrl ? `📲 Ou scannez le QR code pour réserver!` : ''}
    `.trim();

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);

    // Ouvrir WhatsApp
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  }
}
