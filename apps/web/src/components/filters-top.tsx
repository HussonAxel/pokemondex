import { getTypeClasses, pokemonCollectionFilterMap } from "@/data/data";
import { Route } from "@/routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FilterTag } from "./ui/filter-tag";

export const FiltersTop = () => {
  const searchParams = useSearch({ from: Route.id });
  const navigate = useNavigate({ from: Route.id });

  const activePokemon = searchParams.activePokemon
  const types = searchParams.type ?? [];
  const abilities = searchParams.ability ?? [];
  const activeCollection = searchParams.collection
    ? pokemonCollectionFilterMap[searchParams.collection]
    : undefined;

  return (
    <div className="w-full rounded-sm mx-auto p-2 gap-3 border border-border flex flex-wrap min-h-[46px]">

      {activePokemon ? (
        <FilterTag
          className="bg-muted/40 border-dashed border-border text-muted-foreground hover:bg-muted/60 cursor-pointer"
          label="SELECTED"
          onRemove={() =>
            navigate({
              search: {
                ...searchParams,
                activePokemon: undefined,
                page: 1,
              },
            })
          }
          value={`#${activePokemon}`}
          valueClassName="font-mono text-foreground"
        />
      ) : null}
      {activeCollection ? (
        <FilterTag
          className="bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80 cursor-pointer"
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
        const colors = getTypeClasses(type);

        return (
          <FilterTag
            key={type}
            className={`${colors.bg} ${colors.border} ${colors.hover} cursor-pointer`}
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
          />
        );
      })}

      {abilities.map((ability) => (
        <FilterTag
          key={ability}
          className="bg-primary/10 border-primary/60 hover:bg-primary/20 cursor-pointer"
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
