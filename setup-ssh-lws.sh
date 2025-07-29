#!/bin/bash

# 🔑 Script de configuration SSH pour LWS
# Ajoute la clé SSH publique au serveur

echo "🔑 Configuration SSH pour LWS"
echo "============================="

# Clé SSH publique fournie
SSH_PUBLIC_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCIB9dVw+/7T4znyoByZ/ZFNiRmO+77wR2GwTGm67B19TXfHCkBWiK8Gh9P90a7o9si57rdLWNGlN01f3j6K4WgccPfKaXTVKIqAu+84h+lRKhIlEBAkyYR/exKuF5/72LknEquS5kGB5osT9pyUWDhEpjDTeyCf5H0agz6PlJIAW8rSJjhmwa32o2Oq3SYTrx6vZFThc56xrTGKcZ436QjEeJidhEQRyqcbCVAiHrHwrlaDynquWEKtvKFOobmKTNzDsjlyijM4yciW652lZ3E8kOTogQ2C81iRiDMwe60WHvfVIuZ6v58mhbX0Jk2NvoujfxyK9wXucHSm5Z+InlL"

echo "📋 Instructions pour configurer SSH :"
echo "====================================="
echo ""
echo "1️⃣  Connectez-vous à votre panneau LWS"
echo "2️⃣  Allez dans 'SSH Keys' ou 'Clés SSH'"
echo "3️⃣  Ajoutez cette clé publique :"
echo ""
echo "$SSH_PUBLIC_KEY"
echo ""
echo "4️⃣  Ou si vous avez déjà accès SSH, exécutez sur le serveur :"
echo ""
echo "mkdir -p ~/.ssh"
echo "echo '$SSH_PUBLIC_KEY' >> ~/.ssh/authorized_keys"
echo "chmod 700 ~/.ssh"
echo "chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "5️⃣  Testez la connexion :"
echo "ssh votre-utilisateur@votre-serveur-lws.com"
echo ""
echo "🔍 Informations nécessaires pour la connexion :"
echo "==============================================="
echo "- Nom d'utilisateur SSH"
echo "- Adresse du serveur LWS"
echo "- Port SSH (généralement 22)"
echo ""
echo "📞 Si vous n'avez pas ces informations, contactez le support LWS" 