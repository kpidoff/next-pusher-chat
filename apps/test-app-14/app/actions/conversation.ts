'use server';

import { Attachment } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export async function sendMessage({
  content,
  userId,
  conversationId,
  eventId,
  attachments,
}: {
  content: string;
  userId: string;
  conversationId: string;
  eventId: string;
  attachments?: Omit<Attachment, 'id' | 'createdAt' | 'messageId'>[];
}) {
  try {
    const message = await prisma.message.create({
      data: {
        content,
        userId,
        conversationId,
        eventId,
        attachments: attachments ? {
          create: attachments.map((attachment) => ({
            url: attachment.url,
            name: attachment.name,
            type: attachment.type || 'application/octet-stream',
            size: attachment.size,
          })),
        } : undefined,
      },
      include: {
        attachments: true,
      },
    });

    return message;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw new Error('Impossible d\'envoyer le message');
  }
}

export async function getMessages(conversationId: string, oldestMessageId?: string) {
  try {

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        ...(oldestMessageId && {
          id: {
            lt: oldestMessageId // Récupère les messages plus anciens que oldestMessageId
          }
        })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        attachments: true,
        seenBy: {
          select: {
            userId: true,
            seenAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc', // On trie par date décroissante pour avoir les plus récents en premier
      },
      take: 30, // On limite à 30 messages
    });

    // On retourne les messages dans l'ordre chronologique
    return messages.reverse().map(msg => ({
      ...msg,
      type: msg.type || 'message' // On s'assure que le type est toujours défini
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    throw new Error('Impossible de récupérer les messages');
  }
} 

export async function getMessageByEventId(eventId: string) {
  try {
    const message = await prisma.message.findFirst({
      where: {
        eventId,  
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        attachments: true,
      },
    });

    return message;
  } catch (error) {
    console.error('Erreur lors de la récupération du message:', error);
    throw new Error('Impossible de récupérer le message');
  }
} 

export async function getParticipants(conversationId: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        conversations: {
          some: {
            conversationId: conversationId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        // ajoutez d'autres champs si besoin
      },
    });

    return users;
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    throw new Error('Impossible de récupérer les participants');
  }
} 

export async function markAllMessagesAsSeen(conversationId: string, userId: string) {
  try {
    // Récupérer tous les messages non lus de la conversation
    const unreadMessages = await prisma.message.findMany({
      where: {
        conversationId,
        userId: {
          not: userId // Exclure les messages de l'utilisateur actuel
        },
        seenBy: {
          none: {
            userId: userId // Messages qui n'ont pas été vus par l'utilisateur
          }
        }
      },
      select: {
        id: true
      }
    });

    // Marquer tous les messages comme lus
    await prisma.$transaction(
      unreadMessages.map(message => 
        prisma.messageSeen.create({
          data: {
            messageId: message.id,
            userId: userId,
            seenAt: new Date()
          }
        })
      )
    );

    return { success: true, count: unreadMessages.length };
  } catch (error) {
    console.error('Erreur lors du marquage des messages comme lus:', error);
    throw new Error('Impossible de marquer les messages comme lus');
  }
} 

export async function getAttachments(conversationId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        attachments: {
          some: {} // S'assure qu'il y a au moins une pièce jointe
        }
      },
      include: {
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const attachments = messages.flatMap(message => 
      message.attachments.map(attachment => ({
        ...attachment,
      }))
    );

    return attachments;
  } catch (error) {
    console.error('Erreur lors de la récupération des pièces jointes:', error);
    throw new Error('Impossible de récupérer les pièces jointes');
  }
}

export async function getTotalMessages(conversationId: string) {
  try {
    const totalMessages = await prisma.message.count({
      where: {
        conversationId, 
      },
    });
    return totalMessages;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre total de messages:', error);
    throw new Error('Impossible de récupérer le nombre total de messages');
  }
}


