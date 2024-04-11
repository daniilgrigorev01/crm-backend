-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_clientId_fkey";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
