'use client';

import React from "react";
import { useState, ReactNode } from 'react';
import { ChevronRight, Activity, Settings, Bell, Camera } from 'lucide-react';
import styles from './custom-tabs.module.css';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const getTabIcon = (value: string) => {
    switch (value.toLowerCase()) {
      case 'activity':
        return <Activity size={16} />;
      case 'alerts':
        return <Bell size={16} />;
      case 'cameras':
        return <Camera size={16} />;
      case 'settings':
        return <Settings size={16} />;
      default:
        return <ChevronRight size={16} />;
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === TabsList) {
        return React.cloneElement(
          child,
          {},
          React.Children.map((child as React.ReactElement<TabsListProps>).props.children, (tabTrigger) => {
            if (
              React.isValidElement(tabTrigger) &&
              typeof tabTrigger.type === "function" &&
              tabTrigger.type.name === "TabsTrigger"
            ) {
              const { value } = (tabTrigger as React.ReactElement<TabsTriggerProps>).props;
              return React.cloneElement(
                tabTrigger as React.ReactElement<TabsTriggerProps>,
                {
                  active: activeTab === value,
                  icon: getTabIcon(value),
                  onClick: () => setActiveTab(value)
                }
              );
            }
            return tabTrigger;
          })
        );
      } else if (child.type === TabsContent) {
        const { value } = (child as React.ReactElement<TabsContentProps>).props;
        return React.cloneElement(
          child as React.ReactElement<TabsContentProps>,
          {
            active: activeTab === value
          }
        );
      }
    }
    return child;
  });

  return (
    <div className={styles.tabs}>
      {childrenWithProps}
    </div>
  );
}

interface TabsListProps {
  children: ReactNode;
}

export function TabsList({ children }: TabsListProps) {
  return <div className={styles.tabList}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  active?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

export function TabsTrigger({ value, children, active, icon, onClick }: TabsTriggerProps) {
  return (
    <button
      className={`${styles.tabTrigger} ${active ? styles.active : ''}`}
      value={value}
      onClick={onClick}
    >
      <span className={styles.tabTriggerContent}>
        {icon && <span className={styles.tabIcon}>{icon}</span>}
        {children}
      </span>
      {active && <span className={styles.activeIndicator} />}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  active?: boolean;
}

export function TabsContent({ value, children, active }: TabsContentProps) {
  return (
    <div className={`${styles.tabContent} ${active ? styles.active : ''}`} data-value={value}>
      {active && children}
    </div>
  );
}