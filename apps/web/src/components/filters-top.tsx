import { pokemonCollectionFilterMap } from "@/data/data";
import {
  getPokemonTypeStyle,
  pokemonTypeHoverClassName,
  pokemonTypeSurfaceClassName,
} from "@/lib/pokemon-type-styles";
import { Route } from "@/routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FilterTag } from "./ui/filter-tag";

export const FiltersTop = () => {
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });

  const types = searchParams.type ?? [];
  const abilities = searchParams.ability ?? [];
  const activeCollection = searchParams.collection
    ? pokemonCollectionFilterMap[searchParams.collection]
    : undefined;

  return (
    <div className="mx-auto flex min-h-[46px] w-full flex-wrap items-center gap-2 rounded-sm border border-border bg-muted/20 px-2 py-2">
      {activeCollection ? (
        <FilterTag
          className="border-sidebar-border bg-sidebar-accent hover:bg-accent dark:hover:bg-accent"
          label="FILTER"
          onRemove={() =>
            navigate({
              search: {
                ...searchParams,
                collection: undefined,
                page: 1,
              },
            })
          }
          value={activeCollection.title}
        />
      ) : null}

      {types.map((type) => {
        const typeStyle = getPokemonTypeStyle(type);

        return (
          <FilterTag
            key={type}
            className={`${pokemonTypeSurfaceClassName} ${pokemonTypeHoverClassName}`}
            label="TYPE"
            onRemove={() =>
              navigate({
                search: {
                  ...searchParams,
                  type:
                    types.length > 1
                      ? types.filter((t) => t !== type)
                      : undefined,
                  page: 1,
                },
              })
            }
            value={type}
            style={typeStyle}
          />
        );
      })}

      {abilities.map((ability) => (
        <FilterTag
          key={ability}
          className="border-primary/40 bg-primary/10 hover:bg-primary/20 dark:border-primary/40 dark:bg-primary/10 dark:hover:bg-primary/20"
          label="ABILITY"
          onRemove={() =>
            navigate({
              search: {
                ...searchParams,
                ability:
                  abilities.length > 1
                    ? abilities.filter((a) => a !== ability)
                    : undefined,
                page: 1,
              },
            })
          }
          value={ability}
          valueClassName="font-mono"
        />
      ))}
    </div>
  );
};
