import hatImage from "@/assets/images/hat-min.png";
import { Film } from "./FilmsDashboard";

interface MagicHatProps {
  randomisedFilm: Film | null,
}

function MagicHat({ randomisedFilm }: MagicHatProps) {
  return (
    <div className="relative magic-hat-container">
      {randomisedFilm && (
        <div
          key={randomisedFilm.id}
          className="text-neutral-900 animate-film absolute top-0 w-full text-3xl text-center text-ellipsis overflow-hidden"
        >
          {randomisedFilm.title}
        </div>
      )}
      <img
        loading="lazy"
        className="mt-10 modal-image"
        draggable="false"
        src={hatImage}
        width={798}
        height={409}
        alt=""
      />
    </div>
  );
}

export default MagicHat;
