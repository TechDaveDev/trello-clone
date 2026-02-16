import { AlertCircle } from 'lucide-react';

interface LogoutContentProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutContent({ onConfirm, onCancel }: LogoutContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
          <AlertCircle size={32} />
        </div>
        <p className="text-foreground/70 text-sm">
          ¿Seguro de que deseas cerrar sesión?<br />Si inicias sesión podrás volver a ver tus columnas.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-background border border-border rounded-xl hover:bg-card transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold shadow-lg shadow-red-500/20"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}